const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const { sendWelcomeEmail, sendGoodByeEmail } = require('../mail/account')

router.post('/users', async (req, res) => {
    
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }

    // The code was now refactored using async await and written above
    // user.save().then((user) => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async  (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {

        // Need to delete all teh KWT tokens that were used to log in from different devices
        req.user.tokens = []

        // Next, we need to save the user to the database
        await req.user.save()

        // Once saved, send the response to the client
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    
    res.send(req.user)
    
    
    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }

   

    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }

    //     res.send(user)

    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user) {
        //     return res.status(404).send()
        // }

        // the same result as above
        await req.user.remove()
        // sendGoodByeEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }

})

// Note that with this we can update any user.
// but we certainly do not want that
// so, we will create another route, where any authenticated user will be able to updatr their own profile

/*router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {

        // The findByIdAndUpdate function bypasses the mongoose middleware and directly performs operations on the database
        // So, we will now replace the sing code line with separate operations:
        // i. get the updates
        // ii. retrieve the user by id
        // iii. change the properties in the user object
        // iv. save the new object
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            // normally this func returns the old user.
            // new: true will return the object after the update

            // new: true,

            // This will run the validator that we have written in the User model
            // runValidators: true
        // })

        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(400).send()
        }

        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()

        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }

})*/

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try {
        
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }

})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload jpg or jpeg or png files under 1Mb'))
        }

        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')

        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined

    await req.user.save()

    res.status(201).send()
})

module.exports = router
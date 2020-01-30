const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async  (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        // We are storing this in the req because, we have already got the user,
        // and there is no need for other methods to rerun and get the users again
        // We are embedding this into the req so that it is now directly accessible

        req.user = user
        req.token = token

        next()

    } catch (e) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// When we pass the structure of the new model to be created,
// mongoose creates something that is called schema.
// Now we will create the schema on our own and then pass it to model function and also set up some middleware on the same schema.


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password contains phrase password!!')
            }
        }
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                console.log('Invalid Email')
                throw new Error('Invalid Email')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// These are virtual fields
// These fields do not exist directly on the schema
// but get populated during runtime
// so, this basically defines the relation between fields
// and reference from where it will be populated

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// other than built in functions that are available on the User model,
// using schema.statics we can create new user defined methods as below
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    
    const error = new Error()
    error.message = 'Unable to log in'
    error.description = 'Invalid Credentials'
    error.name = 'Error'

    if (!user) throw error

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw error

    return user
}

// .methods are instance methods, whereas .statics are model methods
userSchema.methods.generateAuthToken = async function () {
    const user = this

    // _id is used to give jwt a source using which the token will be generated
    // for our case, the id is the user id
    // additionally the secret code is provided alongside the parameters
    // this is the same secrect code that will be used to decode the user when required
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()


    // Note that here we are saving an object into the array.
    // These objects are considered as subdocuments in mongodb
    // They will have an id of their own in the db
    return token
}


// Below 2 methods can be used to hide sensetive information
// First is a manual way, where we assign the user object to another object
// Delete the sensetive info and then send back the updated object
// But this includes, manually calling this function before sending the response
userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
    
}

// But, creating a toJSON method, automatically removes the need for calling this method directly
// Basically this acts as method overloading
// The normal toJSON method is called implicitly whenever we send any response back to the client
// modifying the method for particular objects and deleteing the attribute will send back the manipulated object
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
    
}

// The pre function is defined on the schema, which mentions an  event and what to do when that event occurs
userSchema.pre('save', async function (next) {

    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // next is a function, that marks the end of the execution of the async func.
    // if next is not called, the function will never return control to the main function
    next()
})

// Delete the tasks when a user deletes himself
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({
        owner: user._id
    })

    next()
})

const User = mongoose.model('User', userSchema)


module.exports = User
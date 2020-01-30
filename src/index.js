const express = require('express')
const {ObjectId} = require('mongodb')
require('./db/mongoose')
const app = express()
const port = process.env.PORT
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// app.use((req, res, next) => {
    
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         // Calling the next() function is mandatory.
//         // The app won't run further if we don't
//         // Next functions are part of express middleware
//     next()
//     }

   
// })

// app.use((req, res, next) => {
//     res.status(503).send('Services are currently down. We will be back soon!!')
// })

// -------------------------------------------------

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is running at port ', port)
})
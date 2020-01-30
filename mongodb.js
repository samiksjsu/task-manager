// const mongodb = require('mongodb');
// const MongoClient  = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID

// Writing the same using object destructuring
const {MongoClient, ObjectID} = require('mongodb');

// const id = new ObjectID();
// console.log(id.id);
// console.log(id.getTimestamp());

const connectionURL = process.env.MONGODB_URL;
const databaseName = 'task-manager';

 MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database!');
//     } 

//     const db = client.db(databaseName);
//     // db.collection('users').insertOne({
//     //     //_id: id,
//     //     name: 'Samik',
//     //     age: 27
//     // }, (error, result) => {
//     //     if (error) {
//     //         return console.log('unable to insert user!');
//     //     }

//     //     console.log(result.ops);
//     // })

//     // db.collection('users').insertMany([
//     //     {name: 'KK',
//     //     age: 28}, 
//     //     {
//     //     name: 'Kartik',
//     //     age: 25
//     //     }
//     // ], (error, result) => {
//     //     if (error) {
//     //         return console.log('Could not insert documents!');
//     //     }

//     //     console.log(result.ops);
// })



//     // db.collection('tasks').insertMany([
//     //     {
//     //         description: 'Buy a new laptop',
//     //         completed: true 
//     //     }, 
//     //     {
//     //         description: 'Learn Node.js',
//     //         completed: false
//     //     },
//     //     {
//     //         description: 'Solve Leetcode',
//     //         completed: false
//     //     }
//     // ], (error, result) => {
//     //     if (error) {
//     //         return console.log('Unable to insert into tasks!!!');
//     //     }

//     //     console.log(result.ops);
//     // })
 })


MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to DB!!!');
//     }

//     const db = client.db(databaseName);

//     // db.collection('users').findOne({ _id: new ObjectID("5e1280d585740c631031c66b") }, (error, user) => {
//     //     if (error) {
//     //         return console.log('Unable to fetch!!!');
//     //     }

//     //     console.log(user);
//     // })


//     // db.collection('users').find({ age: 27 }).toArray((error, users) => {
//     //     if (error) {
//     //         return console.log('Error!!!');
//     //     }

//     //     console.log(users);
//     // })

//     // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
//     //     console.log(tasks);
//     // })
// })

// MongoClient.connect(connectionURL,{useUnifiedTopology: true} , (error, client) => {
//     if (error) {
//         return console.log('Could not connect to the database!!');
//     }

//     const db = client.db(databaseName);

    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e1280d585740c631031c66b")
    // }, 
    // {
    //     $inc: {
    //         age: 3
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').updateMany(

    //     {
    //         completed: false
    //     }, 
    //     {
    //         $set: {
    //             completed: true
    //         }
    //     }
    // ).then((result) => {
    //     console.log('Update Successful!!');
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('users').deleteMany(
    //     {
    //         name: 'Samik'
    //     }
        
    // ).then((result) => {
    //     console.log(result);
    //     console.log('Delete Successfull');
    // }).catch((error) => {
    //     console.log('Could not be deleted!! Error occurred');
    //     console.log(error);
    // })
})



MongoClient.connect(connectionURL, {useUnifiedTopology: true}).then((client => {


    console.log('Connection Successful to MongoDB server');

    // Connecting to specific db inside MongoDB server
    const db = client.db(databaseName); // databaseName = task-manager

    db.collection('users').findOne({
        name: 'Samik'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})).catch((error) => {
    console.log(error);
})
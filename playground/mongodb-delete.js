// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // deletemany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) =>{
    //   console.log(result);
    // });
    //delete one
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) =>{
    //   console.log(result);
    // })

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({completed:false }).then((result) => {
      console.log(result);
    })

    db.collection('Users').deleteMany({name: 'Kenneth'}).then((result) =>{
      console.log(result);
    });

    db.collection('Users').findOneAndDelete({
      _id: new ObjectID("5c2449129a05712660fc3c24"
    )}).then((result) => {
      console.log(result);
    })
    //client.close();
});

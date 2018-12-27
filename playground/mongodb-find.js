// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //fetch all todos document to an Array
    // db.collection('Todos').find({
    //   _id: new ObjectID('5c244f0f21577258773f81a7')
    // }).toArray().then((docs) => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('unable to fetch todos', err)
    // });

    // db.collection('Todos').find().count().then((count) => {
    //   console.log(`Todos count: ${count}`);
    // }, (err) => {
    //   console.log('unable to fetch todos', err)
    // });

    db.collection('Users').find({name: 'Kenneth'}).count().then((count) => {
      console.log(`Todos count: ${count}`);
    }, (err) => {
      console.log('unable to fetch todos', err)
    });


    //client.close();
});

const {ObjectID} = require('mongoDB');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');

// Todo.remove({{}}).then(result=> {
//   console.log(result);
// })

Todo.findOneAndRemove({_id: '5c28684966d5264ff08e92f2'}).then(doc) =>{

});

Todo.findByIdAndRemove('5c28684966d5264ff08e92f2').then((doc) => {
  console.log(doc);
})

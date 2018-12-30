var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //use the javascript promise instead of 3rd party
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};

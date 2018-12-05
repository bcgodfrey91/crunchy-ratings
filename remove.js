const mongoose = require('mongoose');
const Show = require('./models/show');
require('dotenv').config();

// Mongo Variables
mongoose.connect(process.env.MONGO)
  .then(connection => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Mongoose Err:', error.message)
  });

const removeDB = () => {
  // Show.find({}, 'title')
  // .then(r => r.forEach(show => Show.where().findOneAndRemove({}, show.title)));



  // Show.find({}, 'title')
  // .then(r => console.log(r.length));
}
removeDB();

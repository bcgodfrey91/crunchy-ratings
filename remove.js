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
  // Show.remove({}, function (err) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }

  //   console.log('done');
  // });


  // Show.find()
  // .then(r => console.log(r.length));
}
removeDB();

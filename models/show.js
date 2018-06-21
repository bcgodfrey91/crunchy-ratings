const mongoose = require('mongoose');

const showSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  rating: String,
  url: String,
  votes: String,
  image: String,
})

module.exports = mongoose.model('Show', showSchema);

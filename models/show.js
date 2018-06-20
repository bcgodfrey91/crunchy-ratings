const mongoose = require('mongoose');

const showSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  rating: String
})

module.exports = mongoose.model('Show', showSchema);

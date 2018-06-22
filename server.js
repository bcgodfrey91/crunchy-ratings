const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Show = require('./models/show');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port, () => console.log(`Listening on port ${port}`));


mongoose.connect(process.env.MONGO)
.then(connection => {
  console.log('Connected to MongoDB')
})
.catch(error => {
  console.log('Mongoose Err:', error.message)
});

app.get('/', (req, res) => {
  Show.find()
  .then(response => res.status(201).send(response))
  .catch(err => res.status(500).send(err));
});

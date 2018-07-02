const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Show = require('./models/show');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

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

app.get('/shows', (req, res) => {
  Show.find()
  .then(response => {
    const showList = [];
    response.filter(show => {
      if (parseInt(show.votes) >= 400) {
        const votes = parseInt(show.votes);
        const votesAndMin = votes + 400;
        const wA = (votes / votesAndMin) * parseFloat(show.rating) + (400 / votesAndMin) * 4.6;
        const roundedWA = Math.max(Math.round(wA * 100) / 100, 2.8).toFixed(2);
        show.rating = roundedWA;
        showList.push(show);
      }
    })
    res.send(showList.sort((a, b) => b.rating - a.rating));
  })
  .catch(err => res.status(500).send(err));
});

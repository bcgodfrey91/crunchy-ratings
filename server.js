const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio');
const sortedUniqBy = require('lodash/sortedUniqBy');

const app = express();
const port = process.env.PORT || 5000;

const alpha = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd',
  4: 'e',
  5: 'f',
  6: 'g',
  7: 'h',
  8: 'i',
  9: 'j',
  10: 'k',
  11: 'l',
  12: 'm',
  13: 'n',
  14: 'o',
  15: 'p',
  16: 'q',
  17: 'r',
  18: 's',
  19: 't',
  20: 'u',
  21: 'v',
  22: 'w',
  23: 'x',
  24: 'y',
  25: 'z',
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.shows = [];
app.locals.sorted;

app.get('/', (req, res) => {
  for (var item in alpha) {
    request(`http://www.crunchyroll.com/videos/anime/alpha?group=${alpha[item]}`, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        $('span.series-title').each(function(i, element) {
          let text = $(this).text();
          let url = $(this).parent().parent().attr('href');
          let metadata = {
            title: text,
            url,
          };
          app.locals.shows.push(metadata);
        });
      }
    });
  }
  res.send('done');
});


// unnecessary step -- only need to remove duplicates and then sort at the final step instead
app.get('/sorted', (req, res) => {
  const sorted = app.locals.shows.sort((a, b) => {
    var nameA = a.title.toUpperCase();
    var nameB = b.title.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  })

  app.locals.sorted = sortedUniqBy(sorted, "title");
  res.send('donezo');
})

app.get('/sorted2', (req, res) => {
  for (var show in app.locals.sorted) {
    let title = app.locals.sorted[show].title;
    request(`http://www.crunchyroll.com/${app.locals.sorted[show].url}/reviews/helpful/page1`, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let description = $('span.more').text();
        let rating = $('span #showview_about_avgRatingText').text();

        console.log(title);
      }
    });
  }
  res.send('cool');
})


app.listen(port, () => console.log(`Listening on port ${port}`));

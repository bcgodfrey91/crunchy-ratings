const request = require('request');
const cheerio = require('cheerio');
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

for (var item in alpha) {
  request(`http://www.crunchyroll.com/videos/anime/alpha?group=a`, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      $('span.series-title').each(function (i, element) {
        let text = $(this).text();
        let url = $(this).parent().parent().attr('href');
        let metadata = {
          title: text,
          href: url
        }
        shows.push(metadata);
      });
    }
  });
}


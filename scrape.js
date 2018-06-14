const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const uniq = require('lodash/uniq');

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
  26: 'numeric',
}

const createListOfUrlsByAlpha = () => {
  const options = [];
  for (item in alpha) {
    const option = {
      uri: `http://www.crunchyroll.com/videos/anime/alpha?group=${alpha[item]}`,
      transform: function (html) {
        return cheerio.load(html);
      },
    }
    options.push(option);
  }
  return options
}

const scrapeShowHref = ($) => {
  const urlsForPage= [];
  $('span.series-title').each(function (i, element) {
    let url = $(this).parent().parent().attr('href');
    urlsForPage.push(url);
  });
  return urlsForPage;
}

async function createListOfShowHrefs(options) {
  let allUrls = [];
  for (option in options) {
    const urlOption = await rp(options[option]);
    const showsForUrl = await scrapeShowHref(urlOption);

    allUrls = allUrls.concat(showsForUrl);
  }
  return uniq(allUrls);
};

const createListOfUrlsForEachAnime = (urls) => {
  const options = [];
  for (url in urls) {
    const option = {
      uri: `http://www.crunchyroll.com/${urls[url]}/reviews/helpful/page1`,
      transform: function (html) {
        return cheerio.load(html);
      },
    }
    options.push(option);
  }
  return options;
}

async function doThingsPlease() {
  const listOfUrlsByAlpha = await createListOfUrlsByAlpha();
  const listOfHrefForShows = await createListOfShowHrefs(listOfUrlsByAlpha);
  const listOfUrlsForAnime = await createListOfUrlsForEachAnime(listOfHrefForShows);
}

doThingsPlease();

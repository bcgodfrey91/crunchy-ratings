const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const uniq = require('lodash/uniq');
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
  console.log('alpha list created');
  return options
}

const scrapeShowHref = ($) => {
  const urlsForPage = [];
  $('span.series-title').each(function (i, element) {
    let url = $(this).parent().parent().attr('href');
    urlsForPage.push(url);
  });
  console.log('urls scraped');
  return urlsForPage;
}

async function createListOfShowHrefs(options) {
  let allUrls = [];
  for (option in options) {
    const urlOption = await rp(options[option]);
    const showsForUrl = await scrapeShowHref(urlOption);

    allUrls = allUrls.concat(showsForUrl);
  }
  console.log('page hrefs created');
  return uniq(allUrls);
};

const createListOfUrlsForEachAnime = (urls) => {
  const options = [];
  for (url in urls) {
    const option = {
      uri: `http://www.crunchyroll.com${urls[url]}/reviews`,
      transform: function (html) {
        return cheerio.load(html);
      },
    }
    options.push(option);
  }
  console.log('anime urls created');
  return options;
}

const scrapeShowData = ($, link) => {
  const description = $('span.more').text().trim();
  const rating = $('span #showview_about_avgRatingText').text();
  const title = $('span[itemprop=name]').text();
  const url = link.replace(/reviews/g, '');

  const metadata = {
    title,
    description,
    rating,
    url
  }
  console.log('metadata created');
  return metadata
}

async function getShowData(options) {
  let allShowData = [];
  console.log('scraping data');
  for (option in options) {
    const url = options[option];
    const pageForShow = await rp(url);
    const showData = await scrapeShowData(pageForShow, url.uri);

    allShowData.push(showData);
  }
  return allShowData;
}

const sortAnimeByRating = (animeList) => {
  const sortedByRating = animeList.sort((a, b) => b.rating - a.rating);
  console.log('anime sorted by rating');
  return sortedByRating;
}

const sendAnimeToDB = (shows) => {
  console.log('pushing to DB');
  shows.forEach((anime) => {
    let show = new Show({
      _id: new mongoose.Types.ObjectId(),
      name: anime.title,
      description: anime.description,
      rating: anime.rating
    })

    show.save()
    .then(result =>  console.log(result))
    .catch(err => console.log(err))
  })
}

async function doTheScrape() {
  const listOfUrlsByAlpha = await createListOfUrlsByAlpha();
  const listOfHrefForShows = await createListOfShowHrefs(listOfUrlsByAlpha);
  const listOfUrlsForAnime = await createListOfUrlsForEachAnime(listOfHrefForShows);
  const listOfShows = await getShowData(listOfUrlsForAnime);
  const sortedAnime = await sortAnimeByRating(dataForShows);
  const saveAnimeToDB = await sendAnimeToDB(sortedAnime);
}

doTheScrape();

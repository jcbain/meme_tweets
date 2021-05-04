const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  twitterBearerHistorical: process.env.TWITTER_BEARER_HISTORICAL,
  twitterBearerSearch: process.env.TWITTER_BEARER_SEARCH,
};
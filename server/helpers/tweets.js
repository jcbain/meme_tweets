const { twitterBearerSearch, twitterBearerHistorical } = require('../config')

const formatParams = ( params ) => {
    const startString = `start_time=${params.startTime}`;
    const endString = `end_time=${params.endTime}`;
    const fieldsString = `tweet.fields=${params.tweetFields.join(',')}`

    return { startString, endString, fieldsString };

}

const createHeaders = ( isHistorical ) => {
    const bearer = isHistorical && twitterBearerHistorical ? twitterBearerHistorical : twitterBearerSearch;
    const headers = { headers: { AUTHORIZATION : `Bearer ${bearer}`} };
    return headers;
}

const chooseStream = ( isHistorical ) => {
    const type = isHistorical ? 'all' : 'recent';
    const baseUrl = `https://api.twitter.com/2/tweets/search/${type}`;
    return baseUrl
}

module.exports = {
    formatParams,
    createHeaders,
    chooseStream
}
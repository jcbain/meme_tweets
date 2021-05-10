const axios = require('axios').default;
const { formatParams, createHeaders, chooseStream } = require('../helpers/tweets');
const { getYesterday, formatDate } = require('../helpers/dates');

const defaultParams = {
    startTime: formatDate(new Date('2013-01-01T06:00:00Z')),
    endTime: formatDate(getYesterday()),
    tweetFields: [
        'id','text','author_id','context_annotations',
        'geo','conversation_id','withheld','possibly_sensitive',
        'referenced_tweets', 'public_metrics', 'created_at', 'lang'
    ]
}

const getConversation = async (conversationId, isHistorical, nextToken, params=defaultParams) => {
    const headers = createHeaders(isHistorical);
    const baseUrl = chooseStream(isHistorical);
    const query = `query=conversation_id:${conversationId}`;
    const nextString = nextToken ? `next_token=${nextToken}` : '';
    const { startString, endString, fieldsString } = formatParams(params);
    const endpointString = [query, startString, endString, fieldsString, nextString].join('&');
    const fullEndpoint = `${baseUrl}?${endpointString}`;
    const response = await axios.get(fullEndpoint, headers);

    return response;
}


const getConversationByGeography = async (conversationId, lon, lat, nextToken, params=defaultParams) => {
    const headers = createHeaders(true);
    const baseUrl = chooseStream(true);
    const query = `query=(point_radius:[${lon} ${lat} 25mi] conversation_id:${conversationId})`
    const nextString = nextToken ? `next_token=${nextToken}` : '';
    const { startString, endString, fieldsString } = formatParams(params);

    const endpointString = [query, startString, endString, fieldsString, nextString].join('&');
    const fullEndpoint = `${baseUrl}?${endpointString}`;
    console.log(fullEndpoint)
    const response = await axios.get(fullEndpoint, headers);

    return response;
}

module.exports = {
    getConversation,
    getConversationByGeography
}


// getConversationByGeography('1384253384245465100', -74.0060, 40.7128)
//     .then(resp => console.log(resp.data))
//     .catch(err => console.log(err))

    // https://api.twitter.com/2/tweets/search/all?start_time=2015-01-01T00:00:00Z&tweet.fields=id,text,author_id,context_annotations,geo,conversation_id,withheld,possibly_sensitive,referenced_tweets,public_metrics,created_at&query=(point_radius:[-74.0060 40.7128 25mi] conversation_id:1384253384245465100)&end_time=2021-04-21T00:00:00Z
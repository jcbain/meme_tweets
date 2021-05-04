const { twitterBearerSearch, twitterBearerHistorical } = require('../config')

const getYesterday = () => {
    let date = new Date();
    date.setDate(date.getDate() - 1)
    return date;
}

const formatDate = (date) => {
    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}T06:00:00`
}

const defaultParams = {
    startTime: formatDate(new Date('2012-01-01T06:00:00Z')),
    endTime: formatDate(getYesterday()),
    tweetFields: [
        'id','text','author_id','context_annotations',
        'geo','conversation_id','withheld','possibly_sensitive',
        'referenced_tweets', 'public_metrics', 'created_at'
    ]
}

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

const getConversationByGeography = (conversationId, lon, lat, params, nextToken) => {
    const headers = createHeaders(true);
    const baseUrl = chooseStream(true);
    const nextString = nextToken ? `next_token=${nextToken}` : '';


    console.log(formatParams(defaultParams))


}

getConversationByGeography()
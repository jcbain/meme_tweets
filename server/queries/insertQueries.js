const { pick } = require('lodash')

const renameKeys = (obj, newKeys) => {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
}

const cleanUpTweetData = (data, city_id) => {
    const mappedKeys =  {
        id: 'id',
        text: 'tweet_text',
        author_id: 'author_id',
        created_at: 'created_at',
    };

    let cleanedData = [];
    for ( const row of data ){
        const updatedObj = renameKeys(row, mappedKeys);

        const finalRow = pick(updatedObj, 'id', 'tweet_text', 'author_id', 'created_at', 'lang', 'possibly_sensitive')
        cleanedData.push({...finalRow, city_id})
    }

    return cleanedData;
}

const insertIntoTweetsTable = async (db, data, city_id) => {
    const cleaned = cleanUpTweetData(data, city_id)
    const inserted = await db('tweets')
        .insert(cleaned)
        .onConflict('id')
        .ignore()

    return inserted
}

const cleanUpReferencesTweets = (data) => {
    let cleanedData = [];
    data.forEach(row => {
        const { id, referenced_tweets } = row;
        if ( referenced_tweets ){
            referenced_tweets.forEach(tweet => {
                const referenceRow = { tweet_id: id, conversation_id: tweet.id, reference_type: tweet.type };
                cleanedData.push(referenceRow);
            })
        }
    })

    return cleanedData;
}

const insertIntoReferencesTweetsTable = async (db, data) => {
    const cleaned = cleanUpReferencesTweets(data);
    const inserted = await db('references_tweets')
        .insert(cleaned)
        .onConflict(['tweet_id', 'conversation_id'])
        .ignore()

    return inserted;


}

const cleanUpTweetMetricsData = (data) => {
    let cleanedData = [];
    const timeNow = new Date();
    data.forEach(row => {
        const { id, public_metrics } = row;
        if (public_metrics){
            const metricData = { tweet_id: id, collected_at: timeNow, 
                retweet_count: public_metrics.retweet_count, reply_count: public_metrics.reply_count,
                like_count: public_metrics.like_count, quote_count: public_metrics.quote_count
            }
            cleanedData.push(metricData);
        }
    })
    return cleanedData;
}

const insertIntoTweetsMetricsTable = async (db, data) => {
    const cleaned = cleanUpTweetMetricsData(data)
    const inserted = await db('tweet_metrics')
        .insert(cleaned)
        .onConflict(['tweet_id', 'collected_at'])
        .ignore()

    return inserted;
}

const cleanUpEntityData = (data) => {
    let cleanedData = [];
    data.forEach(row => {
        const { context_annotations } = row;
        // console.log(context_annotations)
        if(context_annotations) {
            context_annotations.forEach(ann => {
                const { entity } = ann;
                if(entity) {
                    const newRow = { id, name, description } = entity;
                    cleanedData.push(newRow)
                }
            })
        }
        
    })
    return cleanedData
}


const insertIntoEntitiesTable = async (db, data) => {
    const cleaned = cleanUpEntityData(data)
    const inserted = await db('entity')
        .insert(cleaned)
        .onConflict(['id'])
        .ignore()

    return inserted;
}


const cleanUpDomainData = (data) => {
    let cleanedData = [];
    data.forEach(row => {
        const { context_annotations } = row;
        if(context_annotations) {
            context_annotations.forEach(ann => {
                const { domain } = ann;
                if(domain) {
                    const newRow = { id, name, description } = domain;
                    cleanedData.push(newRow)
                }
            })
        }
    })
    return cleanedData
}

const insertIntoDomainsTable = async (db, data) => {
    const cleaned = cleanUpDomainData(data)
    const inserted = await db('domain')
        .insert(cleaned)
        .onConflict(['id'])
        .ignore()

    return inserted;
}

const cleanUpTweetContextData = (data) => {
    let cleanedData = [];
    data.forEach(row => {
        const { id, context_annotations } = row;
        if(context_annotations){
            context_annotations.forEach(ann => {
                const newRow = { tweet_id: id, domain_id: ann.domain.id, entity_id: ann.entity.id }
                cleanedData.push(newRow)
            })
        }
    })
    return cleanedData;
}

const insertIntoTweetContextTable = async (db, data) => {
    const cleaned = cleanUpTweetContextData(data)
    const inserted = await db('tweet_context')
        .insert(cleaned)
        .onConflict(['tweet_id', 'domain_id', 'entity_id'])
        .ignore()

    return inserted;
}


module.exports = {
    insertIntoTweetsTable,
    insertIntoReferencesTweetsTable,
    insertIntoTweetsMetricsTable,
    insertIntoEntitiesTable,
    insertIntoDomainsTable,
    insertIntoTweetContextTable
}
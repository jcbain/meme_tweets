const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

// const cities = require('./data/cities.json')
const { getAllCities } = require('./queries/pullQueries');
const { insertIntoTweetsTable, insertIntoReferencesTweetsTable, insertIntoTweetsMetricsTable, insertIntoEntitiesTable, insertIntoDomainsTable, insertIntoTweetContextTable } = require('./queries/insertQueries');

const { getConversation, getConversationByGeography } = require('./endpoint_calls/twitter');

// const numCities = cities.length;
const numCities = 100;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/tweets/conversations/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getConversation(id, true)
    console.log(result.data)

})


app.get('/tweets/conversations/:id/geo', async (req, res) => {
    const { id } = req.params;
    const cities = await getAllCities(db);

    let counter = 0;
    let nextToken;

    const interval = setInterval( async() => {
        const currentCity = cities[counter];
        const result = await getConversationByGeography(id, currentCity.lng, currentCity.lat, nextToken)
        nextToken = result.data.meta.next_token ? result.data.meta.next_token : undefined;
        console.log(`inserting for ${currentCity.city_name}`)
        insertIntoTweetsTable(db, result.data.data, currentCity.id).catch(err => console.log(err))
        insertIntoReferencesTweetsTable(db, result.data.data).catch(err => console.log(err))
        insertIntoTweetsMetricsTable(db, result.data.data).catch(err => console.log(err))
        insertIntoEntitiesTable(db, result.data.data).catch(err => console.log(err))
        insertIntoDomainsTable(db, result.data.data).catch(err => console.log(err))
        insertIntoTweetContextTable(db, result.data.data).catch(err => console.log(err))


        // console.log(result.data, currentCity.city_name)
        // console.log(result.data.data[0].context_annotations)


        if( !result.data.meta.next_token ) {
            counter++

        }

        if(counter >= numCities - 1) {
            res.send('done')
            return clearInterval(interval)   
        }

    }, 30000)

    


    // const result = await getConversationByGeography(id, lon, lat)

    // console.log(result.data)
})

app.get('/tweets/conversations/:id/geo/:lon/:lat', async (req, res) => {
    const { id, lon, lat } = req.params;

    const result = await getConversationByGeography(id, lon, lat)

    console.log(result.data)
})

app.listen(port, () => {
    console.log(`🔥 fired up on http://localhost:${port}`);
});
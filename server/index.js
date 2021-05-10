const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

// const cities = require('./data/cities.json')
const { getAllCities, getCityByName } = require('./queries/pullQueries');
const { insertIntoTweetsTable, insertIntoReferencesTweetsTable, insertIntoTweetsMetricsTable, insertIntoEntitiesTable, insertIntoDomainsTable, insertIntoTweetContextTable } = require('./queries/insertQueries');

const { getConversation, getConversationByGeography } = require('./endpoint_calls/twitter');


// const numCities = 1000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/tweets/conversations/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getConversation(id, true)
    console.log(result.data)

})


app.post('/tweets/conversations/:id/geo', async (req, res) => {
    const { id } = req.params;
    const cities = await getAllCities(db);
    const numCities = cities.length;

    
    let counter = 0;
    let nextToken;

    const interval = setInterval( async() => {
        const currentCity = cities[counter];
        const result = await getConversationByGeography(id, currentCity.lng, currentCity.lat, nextToken).catch(err => `err at fetching data: ${err}`)
        nextToken = result.data.meta.next_token ? result.data.meta.next_token : undefined;

        console.log(`attempting to inserting for ${currentCity.city_name}`)
        if(result.data.data){
            await insertIntoTweetsTable(db, result.data.data, currentCity.id).catch(err => console.log(err))
            await insertIntoReferencesTweetsTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoTweetsMetricsTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoEntitiesTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoDomainsTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoTweetContextTable(db, result.data.data).catch(err => console.log(err))
        } else {
            console.log(' no data ')
        }

        if( !result.data.meta.next_token ) {
            counter++
        }
        if(counter >= numCities - 1) {
            return clearInterval(interval)   
        }
        res.status(200)
    }, 5000)
})

app.post('/tweets/conversations/:id/geo/:city', async (req, res) => {
    const { id, city } = req.params;
    try {
        const chosenCities = await getCityByName(db, city)
        const currentCity = chosenCities[0];
        let nextToken;
        // TODO: build in next_token logic 
        const result = await  getConversationByGeography(id, currentCity.lng, currentCity.lat, nextToken).catch(err => `err at fetching data: ${err}`)
        if(result.data.data){
            await insertIntoTweetsTable(db, result.data.data, currentCity.id).catch(err => console.log(err))
            await insertIntoReferencesTweetsTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoTweetsMetricsTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoEntitiesTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoDomainsTable(db, result.data.data).catch(err => console.log(err))
            await insertIntoTweetContextTable(db, result.data.data).catch(err => console.log(err))
        } else {
            console.log(' no data ')
        }

    } catch (e) {
        console.log(e)
        res.status(400)
    } finally {
        res.status(200)
    }

    // const result = await getConversationByGeography(id, lon, lat).catch(err => `err at fetching data: ${err}`)


})

app.listen(port, () => {
    console.log(`🔥 fired up on http://localhost:${port}`);
});
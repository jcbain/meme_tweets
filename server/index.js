const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const cities = require('./data/cities.json')

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
    let counter = 0;
    let nextToken;

    const interval = setInterval( async() => {
        const currentCity = cities[counter];
        const result = await getConversationByGeography(id, currentCity.longitude, currentCity.latitude, nextToken)
        nextToken = result.data.meta.next_token ? result.data.meta.next_token : undefined;
        console.log(result.data, currentCity.city)
        console.log(result.data.data[0].context_annotations)

        if( !result.data.meta.next_token ) {
            counter++

        }

        if(counter >= numCities - 1) {
            res.send('done')
            return clearInterval(interval)   
        }

        // counter++
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
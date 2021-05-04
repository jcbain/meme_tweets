const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const cities = require('./data/cities.json')

const { getConversation, getConversationByGeography } = require('./endpoint_calls/twitter');

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
    console.log(cities)

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
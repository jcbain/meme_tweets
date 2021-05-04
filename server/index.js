const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/tweets/conversations/:id', (req, res) => {
    const { id } = req.params;
    res.send('hello')
    console.log(id)

})

app.get('/tweets/conversations/:id/geo/:lon/:lat', (req, res) => {
    const { id, lon, lat } = req.params;
    console.log(id, lon, lat)

})

app.listen(port, () => {
    console.log(`🔥 fired up on http://localhost:${port}`);
});
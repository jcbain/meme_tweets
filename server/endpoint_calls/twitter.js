const { twitterBearerSearch, twitterBearerHistorical } = require('../config')

const dangerPrintEnv = () => {
    console.log(twitterBearerHistorical);
}

dangerPrintEnv()
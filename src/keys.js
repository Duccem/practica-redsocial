const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    database:  {
        URI: process.env.URI,

    }
}
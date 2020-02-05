const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cst = require('./constant');

const port = cst.PORT;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

/**
 * Using Statics folder
 */
app.use('/assets', express.static(path.join(__dirname, 'assets')));

/**
 * Load index.html
 */
app.get('/', (request, response) => {
    // response.json({ info: 'Node.js, Express, and Postgres API' })
    response.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * Start app in port
 */
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

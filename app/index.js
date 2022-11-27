const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


//! Started
const app = express();


//! Setting
app.use(cors()); // core is a function
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));



//! Allow static & content
app.use(express.static(`${__dirname}/www`));


//! Routers
app.get('/', (req, res) => { res.end(`<h1>Server is running!</h1>`); });
app.use('/api', require('./routers'));

module.exports = app;

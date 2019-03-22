const express = require('express');
const routes = require('./routes');
const dbConfig = require('./database.config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// set running ports
let serverPort = process.env.PORT || 3000;

// create express app
const app = express();

// add support for body parsing
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// serve directory that angular builds to
app.use(express.static('../client/dist/registration-portal'));

// use routes defined in routes.js
app.use('/', routes);

mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(
  () => console.log(`Connected to MongoDB on port ${dbConfig.dbPort}`)
).catch(err => {
  console.log('Failed to connect to MongoDB\n Exiting...', err);
  process.exit(1);
});

// listen for requests
app.listen(serverPort);

console.log(`server running on port ${serverPort}`);

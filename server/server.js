const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

// create express app
const app = express();

// add support for body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve directory that angular builds to
app.use(express.static('../client'));

// use routes defined in routes.js
app.use('/', routes);

mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose
  .connect(config.dbUri, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(`Server: connected to MongoDB on port ${config.dbPort} at ${config.database}`);
    if (config.nodeEnv !== 'test') {
      require('./admin-seed').createAdmin();
    }
  })
  .catch(err => {
    console.log(`Failed to connect to MongoDB at ${config.dbUri}\n Exiting...`, err);
    process.exit(1);
  });

// listen for requests
module.exports = app.listen(config.serverPort);

console.log(`Server: running on port ${config.serverPort} in ${config.nodeEnv}`);

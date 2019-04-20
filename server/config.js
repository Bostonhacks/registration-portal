// load enviroment variables from '../.env' file
require('dotenv').config({ path: '../.env' });

var database;

// check if we're running a dev or production instance
const appEnv = process.env.APP_ENV || 'dev';
if(appEnv === 'dev') {
  database = process.env.DB_TEST_NAME || 'registrationTest';
} else {
  database = process.env.DB_NAME || 'registration';
}

// set constants for port and dbname so they can be used in string substitution
const dbPort = process.env.DB_PORT || 27017;

// export all relevant information
module.exports = {
  serverPort: process.env.PORT || 3000,
  dbPort: dbPort,
  database: database,
  dbUri: `mongodb://localhost:${dbPort}/${database}`,
  secret: process.env.SECRET,
};

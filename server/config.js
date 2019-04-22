// load enviroment variables from '../.env' file
require('dotenv').config({ path: '../.env' });

let database;

// check if we're running a dev, test or production instance
const nodeEnv = process.env.NODE_ENV || 'dev';
if (nodeEnv === 'dev') {
  database = process.env.DB_DEV_NAME || 'registrationDev';
} else if (nodeEnv === 'test') {
  database = 'registrationTest';
} else {
  database = process.env.DB_NAME || 'registration';
}

// set constants for port and dbname so they can be used in string substitution
const dbPort = process.env.DB_PORT || 27017;

// export all relevant information
module.exports = {
  serverPort: process.env.PORT || 3000,
  dbPort,
  database,
  dbUri: `mongodb://localhost:${dbPort}/${database}`,
  secret: process.env.SECRET,
  nodeEnv
};

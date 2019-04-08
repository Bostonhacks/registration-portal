// load enviroment variables from '../.env' file
require('dotenv').config({ path: '../.env' });

// set constants for port and dbname so they can be used in string substitution
const dbPort = process.env.DB_PORT || 27017;
const database = process.env.DB_NAME || 'registration';

// export all relevant information
module.exports = {
  serverPort: process.env.PORT || 3000,
  dbPort: dbPort,
  database: database,
  dbUri: `mongodb://localhost:${dbPort}/${database}`,
  secret: process.env.SECRET,
};

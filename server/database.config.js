// specifies mongodb uri and uses the 'admin' collection
var dbPort = 27017;
var database = 'registration';
module.exports = {
  dbPort: dbPort,
  database: database,
  url: `mongodb://localhost:${dbPort}/${database}`,
}

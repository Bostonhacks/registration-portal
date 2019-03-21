// specifies mongodb uri and uses the 'admin' collection
module.exports = {
  dbPort: 27017,
  collection: 'admin',
  url: `mongodb://localhost:${this.dbPort}/${this.collection}`,
}

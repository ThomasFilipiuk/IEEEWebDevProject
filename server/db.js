const { MongoClient } = require('mongodb')

let dbConnection
let uri = 'mongodb+srv://DiningAppIEEE:DineOnCampus123@cluster0\
.i6moqlo.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then(client => {
        dbConnection = client.db('fake_db')
        return cb()
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection
}
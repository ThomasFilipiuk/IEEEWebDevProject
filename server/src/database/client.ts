import dotenv from 'dotenv';

dotenv.config();

const { MongoClient } = require('mongodb')

const uri = process.env.MONGODB_URI
 
const databaseClient = new MongoClient(uri);
try {
  databaseClient.connect(); 
}
catch (e) {
  console.error(e);
}

export default databaseClient;
import databaseClient from "./client";
import dotenv from 'dotenv';

dotenv.config();

function getCollectionObject(collection: string) {
  return databaseClient.db(process.env.MONGODB_DB_NAME).collection(collection);
}

// https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne
async function insertOne(collection: string, document) {
  try {
    const collectionObject = getCollectionObject(collection);

    const response = await collectionObject.insertOne(document);

    return response;
  }
  catch (e) {
    console.error(e);
  }
}

// https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find
async function find(collection: string, query, projection, options) {
  try {
    const collectionObject = getCollectionObject(collection);

    const response = await collectionObject.find(
      query,
      projection,
      options
    );

    return response;
  }
  catch (e) {
    console.error(e);
  }
}

// https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne
async function updateOne(collection: string, filter, update, options) {
  try {
    const collectionObject = getCollectionObject(collection);

    const response = await collectionObject.updateOne(
      filter,
      update,
      options
    );
    
    return response;
  }
  catch (e) {
    console.error(e);
  }
}

// https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne
async function deleteOne(collection: string, filter) {
  try {
    const collectionObject = getCollectionObject(collection);

    const response = await collectionObject.deleteOne(filter);

    return response;
  }
  catch (e) {
    console.error(e);
  }
}


export { insertOne, find, updateOne, deleteOne }
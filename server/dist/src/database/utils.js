"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.find = exports.insertOne = void 0;
const client_1 = __importDefault(require("./client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getCollectionObject(collection) {
    return client_1.default.db(process.env.MONGODB_DB_NAME).collection(collection);
}
// https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne
async function insertOne(collection, document) {
    try {
        const collectionObject = getCollectionObject(collection);
        const response = await collectionObject.insertOne(document);
        return response;
    }
    catch (e) {
        console.error(e);
    }
}
exports.insertOne = insertOne;
// https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find
async function find(collection, query = {}, projection, options) {
    try {
        const collectionObject = getCollectionObject(collection);
        const response = await collectionObject.find(query).toArray();
        console.log("response in find function:", response);
        return response;
    }
    catch (e) {
        console.error(e);
    }
}
exports.find = find;
// https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne
async function updateOne(collection, filter, update, options) {
    try {
        const collectionObject = getCollectionObject(collection);
        const response = await collectionObject.updateOne(filter, update, options);
        return response;
    }
    catch (e) {
        console.error(e);
    }
}
exports.updateOne = updateOne;
// https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#mongodb-method-db.collection.deleteOne
async function deleteOne(collection, filter) {
    try {
        const collectionObject = getCollectionObject(collection);
        const response = await collectionObject.deleteOne(filter);
        return response;
    }
    catch (e) {
        console.error(e);
    }
}
exports.deleteOne = deleteOne;

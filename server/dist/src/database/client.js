"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const databaseClient = new MongoClient(uri);
try {
    databaseClient.connect();
}
catch (e) {
    console.error(e);
}
exports.default = databaseClient;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_BUCKET_REGION;
const accessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    },
    region: bucketRegion
});
exports.default = s3Client;

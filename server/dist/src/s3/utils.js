"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = exports.uploadFile = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_1 = __importDefault(require("./client"));
dotenv_1.default.config();
const bucketName = process.env.S3_BUCKET_NAME;
// uploadFile : Express.Multer.File => string
// uploads a file to s3 bucket, returns the filename of that file
const uploadFile = async (file) => {
    const filename = crypto_1.default.randomBytes(32).toString("hex");
    const putParams = {
        Bucket: bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    const putCommand = new client_s3_1.PutObjectCommand(putParams);
    await client_1.default.send(putCommand);
    return filename;
};
exports.uploadFile = uploadFile;
// getFile: string => string
// searches s3 bucket for a specific filename, returns presigned url
const getFile = async (filename) => {
    const getParams = {
        Bucket: bucketName,
        Key: filename
    };
    const getCommand = new client_s3_1.GetObjectCommand(getParams);
    const url = await (0, s3_request_presigner_1.getSignedUrl)(client_1.default, getCommand, {
        expiresIn: 3600
    });
    return url;
};
exports.getFile = getFile;

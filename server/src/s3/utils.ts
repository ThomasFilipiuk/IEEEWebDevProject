import dotenv from "dotenv";
import crypto from "crypto";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "./client";

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;

// uploadFile : Express.Multer.File => string
// uploads a file to s3 bucket, returns the filename of that file
const uploadFile = async(file: Express.Multer.File) => {
  const filename = crypto.randomBytes(32).toString("hex");
  const putParams = {
    Bucket: bucketName,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  const putCommand = new PutObjectCommand(putParams);
  await s3Client.send(putCommand);

  return filename;
}

// getFile: string => string
// searches s3 bucket for a specific filename, returns presigned url
const getFile = async(filename: string) => {
  const getParams = {
    Bucket: bucketName,
    Key: filename
  };

  const getCommand = new GetObjectCommand(getParams);
  const url = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 3600
  });

  return url;
}

export { uploadFile, getFile }
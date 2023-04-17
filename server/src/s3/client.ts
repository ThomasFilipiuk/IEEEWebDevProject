import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_BUCKET_REGION;
const accessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;

const s3Client = new S3Client({
  credentials: {
    accessKeyId: accessKey as string,
    secretAccessKey: secretKey as string
  },
  region: bucketRegion
});

export default s3Client;
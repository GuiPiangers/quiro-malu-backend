import { S3Client } from "@aws-sdk/client-s3";

const isDevelopment = process.env.NODE_ENV === "development";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_ACCESS_KEY_SECRET!;

export const s3Client = isDevelopment
  ? new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: process.env.BUCKET_REGION || "sa-east-1",
    })
  : new S3Client({
      region: process.env.BUCKET_REGION || "sa-east-1",
    });

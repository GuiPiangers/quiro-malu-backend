import { s3Client } from "../../database/AWS/S3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  deleteExamProps,
  getExamProps,
  IExamsFileStorageRepository,
  saveExamProps,
} from "./IExamsFileStorageRepository";

const bucketName = process.env.BUCKET_NAME!;

export class S3ExamsFileStorage implements IExamsFileStorageRepository {
  async save({
    file,
    userId,
    patientId,
    id: fileName,
  }: saveExamProps): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: `${userId}/${patientId}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3Client.send(command);
  }

  async get({ userId, patientId, id }: getExamProps): Promise<string> {
    const getObjectParams = {
      Bucket: bucketName,
      Key: `${userId}/${patientId}/${id}`,
    };

    const command = new GetObjectCommand(getObjectParams);

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return url;
  }

  async delete(data: deleteExamProps): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

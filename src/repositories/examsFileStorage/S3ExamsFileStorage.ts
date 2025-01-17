import { s3Client } from "../../database/AWS/S3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

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

    s3Client.send(command);
  }

  async get(data: getExamProps): Promise<Buffer> {
    throw new Error("Method not implemented.");
  }

  async delete(data: deleteExamProps): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

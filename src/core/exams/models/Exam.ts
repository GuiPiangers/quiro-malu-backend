import { Entity } from "../../shared/Entity";

export type ExamDTO = {
  id?: string;
  patientId: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
};

export class Exam extends Entity {
  readonly patientId: string;
  readonly fileName: string;
  readonly fileType: string;
  readonly fileSize?: number;

  constructor({ fileName, fileType, patientId, fileSize, id }: ExamDTO) {
    super(id);
    this.patientId = patientId;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = fileSize;
  }

  getDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      fileName: this.fileName,
      fileType: this.fileType,
      fileSize: this.fileSize,
    };
  }
}

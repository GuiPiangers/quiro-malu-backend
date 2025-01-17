import { Entity } from "../../shared/Entity";

export type ExamDTO = {
  id?: string;
  patientId: string;
  fileName: string;
  fileSize?: number;
};

export class Exam extends Entity {
  readonly patientId: string;
  readonly fileName: string;
  readonly fileSize?: number;

  constructor({ fileName, patientId, fileSize, id }: ExamDTO) {
    super(id);
    this.patientId = patientId;
    this.fileName = fileName;
    this.fileSize = fileSize;
  }

  getDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      fileName: this.fileName,
      fileSize: this.fileSize,
    };
  }
}

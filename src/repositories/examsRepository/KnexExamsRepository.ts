import { ExamDTO } from "../../core/exams/models/Exam";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import {
  deleteExamRepositoryProps,
  getExamRepositoryProps,
  IExamsRepository,
  listExamRepositoryProps,
  saveExamRepositoryRepositoryProps,
} from "./IExamsRepository";

export class KnexExamsRepository implements IExamsRepository {
  async save(data: saveExamRepositoryRepositoryProps) {
    await Knex(ETableNames.EXAMS).insert(data);
  }

  async get({
    id,
    patientId,
    userId,
  }: getExamRepositoryProps): Promise<ExamDTO> {
    return await Knex(ETableNames.EXAMS)
      .first("*")
      .where({ id, patientId, userId });
  }

  async list({
    patientId,
    userId,
  }: listExamRepositoryProps): Promise<ExamDTO[]> {
    return await Knex(ETableNames.EXAMS)
      .select("*")
      .where({ patientId, userId });
  }

  async delete({
    id,
    userId,
    patientId,
  }: deleteExamRepositoryProps): Promise<void> {
    await Knex(ETableNames.EXAMS).where({ id, userId, patientId }).del();
  }
}

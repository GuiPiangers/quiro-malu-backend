import { ExamDTO } from "../../core/exams/models/Exam";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import {
  countExamRepositoryProps,
  deleteExamRepositoryProps,
  getExamRepositoryProps,
  IExamsRepository,
  listExamRepositoryProps,
  saveExamRepositoryRepositoryProps,
  updateExamRepositoryRepositoryProps,
} from "./IExamsRepository";

export class KnexExamsRepository implements IExamsRepository {
  async count({
    patientId,
    userId,
  }: countExamRepositoryProps): Promise<{ total: number }> {
    const result = await Knex(ETableNames.EXAMS)
      .count("id as total")
      .where({ patientId, userId })
      .first();

    return result as { total: number };
  }

  async save(data: saveExamRepositoryRepositoryProps) {
    await Knex(ETableNames.EXAMS).insert(data);
  }

  async update({
    id,
    userId,
    patientId,
    ...data
  }: updateExamRepositoryRepositoryProps) {
    await Knex(ETableNames.EXAMS).update(data).where({ id, userId, patientId });
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
    config,
  }: listExamRepositoryProps): Promise<ExamDTO[]> {
    return await Knex(ETableNames.EXAMS)
      .select("*")
      .where({ patientId, userId })
      .andWhere("deleted", false)
      .limit(config.limit)
      .offset(config.offset);
  }

  async delete({
    id,
    userId,
    patientId,
  }: deleteExamRepositoryProps): Promise<void> {
    await Knex(ETableNames.EXAMS).where({ id, userId, patientId }).del();
  }
}

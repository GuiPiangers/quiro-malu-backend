import type { Knex } from "knex";
import { Finance, FinanceDTO } from "../../core/finances/models/Finance";
import { ETableNames } from "../../database/ETableNames";
import {
  setFinanceProps,
  updateFinanceProps,
  deleteFinanceProps,
  getFinanceProps,
  IFinanceRepository,
  listFinanceProps,
  getBySchedulingFinanceProps,
} from "./IFinanceRepository";

export class KnexFinanceRepository implements IFinanceRepository {
  constructor(private readonly knex: Knex) {}

  async create({ clinicId, ...data }: setFinanceProps): Promise<void> {
    return await this.knex(ETableNames.FINANCES).insert({
      ...data,
      clinicId,
    });
  }

  async update({ clinicId, id, ...data }: updateFinanceProps): Promise<void> {
    await this.knex(ETableNames.FINANCES)
      .update(data)
      .where({ id, clinicId });
  }

  async delete({ clinicId, id }: deleteFinanceProps): Promise<void> {
    await this.knex(ETableNames.FINANCES)
      .where({ clinicId, id })
      .del();
  }

  async get({ id, clinicId }: getFinanceProps): Promise<FinanceDTO> {
    return await this.knex(ETableNames.FINANCES)
      .first(
        this.knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ id, clinicId });
  }

  async getByScheduling({
    schedulingId,
    clinicId,
  }: getBySchedulingFinanceProps): Promise<FinanceDTO> {
    return await this.knex(ETableNames.FINANCES)
      .first(
        this.knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ schedulingId, clinicId });
  }

  async list({
    clinicId,
    yearAndMonth: date,
    config,
  }: listFinanceProps): Promise<FinanceDTO[]> {
    const result = this.knex(ETableNames.FINANCES)
      .select(
        this.knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ clinicId })
      .andWhere(this.knex.raw("date_format(date, '%Y-%m')"), "=", `${date}`)
      .orderByRaw("date");

    if (config?.limit !== undefined && config?.offSet !== undefined) {
      return await result.limit(config.limit).offset(config.offSet);
    }

    return await result;
  }
}

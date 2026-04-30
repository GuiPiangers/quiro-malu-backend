import type { Knex } from "knex";
import { Finance, FinanceDTO } from "../../core/finances/models/Finance";
import { ETableNames } from "../../database/ETableNames";
import {
  setFinanceProps,
  deleteFinanceProps,
  getFinanceProps,
  IFinanceRepository,
  listFinanceProps,
  getBySchedulingFinanceProps,
} from "./IFinanceRepository";

export class KnexFinanceRepository implements IFinanceRepository {
  constructor(private readonly knex: Knex) {}

  async create({ userId, ...data }: setFinanceProps): Promise<void> {
    return await this.knex(ETableNames.FINANCES).insert({
      ...data,
      userId,
    });
  }

  async update({ userId, id, ...data }: setFinanceProps): Promise<void> {
    await this.knex(ETableNames.FINANCES).update(data).where({ id, userId });
  }

  async delete({ userId, id }: deleteFinanceProps): Promise<void> {
    await this.knex(ETableNames.FINANCES).where({ userId, id }).del();
  }

  async get({ id, userId }: getFinanceProps): Promise<FinanceDTO> {
    return await this.knex(ETableNames.FINANCES)
      .first(
        this.knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ id, userId });
  }

  async getByScheduling({
    schedulingId,
    userId,
  }: getBySchedulingFinanceProps): Promise<FinanceDTO> {
    return await this.knex(ETableNames.FINANCES)
      .first(
        this.knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ schedulingId, userId });
  }

  async list({
    userId,
    yearAndMonth: date,
    config,
  }: listFinanceProps): Promise<FinanceDTO[]> {
    const result = this.knex(ETableNames.FINANCES)
      .select(
        this.knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ userId })
      .andWhere(this.knex.raw("date_format(date, '%Y-%m')"), "=", `${date}`)
      .orderByRaw("date");

    if (config?.limit !== undefined && config?.offSet !== undefined) {
      return await result.limit(config.limit).offset(config.offSet);
    }

    return await result;
  }
}

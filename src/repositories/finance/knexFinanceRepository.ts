import { Finance, FinanceDTO } from "../../core/finances/models/Finance";
import { Knex } from "../../database";
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
  async create({ userId, ...data }: setFinanceProps): Promise<void> {
    return await Knex(ETableNames.FINANCES).insert({
      ...data,
      userId,
    });
  }

  async update({ userId, id, ...data }: setFinanceProps): Promise<void> {
    await Knex(ETableNames.FINANCES).update(data).where({ id, userId });
  }

  async delete({ userId, id }: deleteFinanceProps): Promise<void> {
    await Knex(ETableNames.FINANCES).where({ userId, id }).del();
  }

  async get({ id, userId }: getFinanceProps): Promise<FinanceDTO> {
    return await Knex(ETableNames.FINANCES)
      .first(
        Knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ id, userId });
  }

  async getByScheduling({
    schedulingId,
    userId,
  }: getBySchedulingFinanceProps): Promise<FinanceDTO> {
    return await Knex(ETableNames.FINANCES)
      .first(
        Knex.raw(
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
    const result = Knex(ETableNames.FINANCES)
      .select(
        Knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ userId })
      .andWhere("date_format(date, '%Y-%m')", "=", `%${date}%`)
      .orderByRaw("date");

    if (config?.limit !== undefined && config?.offSet !== undefined) {
      return await result.limit(config.limit).offset(config.offSet);
    }

    return await result;
  }
}

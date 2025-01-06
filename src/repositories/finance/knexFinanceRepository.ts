import { Finance, FinanceDTO } from "../../core/finances/models/Finance";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import {
  createFinanceProps,
  deleteFinanceProps,
  getFinanceProps,
  IFinanceRepository,
  listFinanceProps,
} from "./IFinanceRepository";

export class KnexFinanceRepository implements IFinanceRepository {
  async create({ userId, ...data }: createFinanceProps): Promise<void> {
    return await Knex(ETableNames.FINANCES).insert({
      ...data,
      userId,
    });
  }

  async update({ userId, id, ...data }: createFinanceProps): Promise<void> {
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

  async list({ userId, config }: listFinanceProps): Promise<FinanceDTO[]> {
    const result = Knex(ETableNames.FINANCES)
      .select(
        Knex.raw(
          "value, description, DATE_FORMAT(date, '%Y-%m-%dT%H:%i') as date, id, patientId, type, paymentMethod",
        ),
      )
      .where({ userId })
      .orderByRaw("date");

    if (config?.limit !== undefined && config?.offSet !== undefined) {
      return await result.limit(config.limit).offset(config.offSet);
    }

    return await result;
  }
}

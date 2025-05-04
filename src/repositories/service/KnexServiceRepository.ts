import { ServiceDTO } from "../../core/service/models/Service";
import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { IServiceRepository, listServiceProps } from "./IServiceRepository";

export class KnexServiceRepository implements IServiceRepository {
  async save({
    userId,
    ...data
  }: ServiceDTO & { userId: string }): Promise<void> {
    return await Knex(ETableNames.SERVICES).insert({
      ...data,
      userId,
    });
  }

  async update({
    id,
    userId,
    ...data
  }: ServiceDTO & { id: string; userId: string }): Promise<void> {
    await Knex(ETableNames.SERVICES).update(data).where({ id, userId });
  }

  async list({ userId, config }: listServiceProps): Promise<ServiceDTO[]> {
    const order = config?.search ? "name" : "created_at";
    const orderDirection = config?.search ? "asc" : "desc";

    const result = Knex(ETableNames.SERVICES)
      .select("*")
      .where({ userId })
      .andWhere("name", "like", `%${config?.search ?? ""}%`)
      .orderBy(order, orderDirection);

    if (config?.limit && config?.offSet) {
      return await result.limit(config.limit).offset(config.offSet);
    }
    return await result;
  }

  async count({
    userId,
    search,
  }: {
    userId: string;
    search?: string;
  }): Promise<[{ total: number }]> {
    const [result] = await Knex(ETableNames.SERVICES)
      .count("id as total")
      .where({ userId })
      .andWhere("name", "like", `%${search ?? ""}%`);
    return [result] as [{ total: number }];
  }

  async get({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<ServiceDTO[]> {
    return await Knex(ETableNames.SERVICES).select("*").where({ userId, id });
  }

  async getByName({
    name,
    userId,
  }: {
    name: string;
    userId: string;
  }): Promise<ServiceDTO[]> {
    return await Knex(ETableNames.SERVICES).select("*").where({ userId, name });
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    await Knex(ETableNames.SERVICES).where({ id, userId }).del();
  }
}

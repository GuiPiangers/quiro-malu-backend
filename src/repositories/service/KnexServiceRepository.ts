import { ServiceDTO } from "../../core/service/models/Service";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";
import { IServiceRepository } from "./IServiceRepository";

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

  async list({
    userId,
    config,
  }: {
    userId: string;
    config?: { limit: number; offSet: number };
  }): Promise<ServiceDTO[]> {
    const result = Knex(ETableNames.SERVICES)
      .select("*")
      .where({ userId })
      .orderBy("updated_at", "desc");

    if (config) {
      return await result.limit(config.limit).offset(config.offSet);
    }
    return await result;
  }

  async count({ userId }: { userId: string }): Promise<[{ total: number }]> {
    const [result] = await Knex(ETableNames.SERVICES)
      .count("id as total")
      .where({ userId });

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

/* eslint-disable eqeqeq */
import { IAnamnesisRepository } from "./IAnamnesisRepository";
import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { ETableNames } from "../../database/ETableNames";
import type { Knex } from "knex";

export class KnexAnamnesisRepository implements IAnamnesisRepository {
  constructor(private readonly knex: Knex) {}

  async save(
    { patientId, ...data }: AnamnesisDTO,
    userId: string,
  ): Promise<void> {
    return await this.knex(ETableNames.ANAMNESIS).insert({
      ...data,
      userId,
      patientId,
    });
  }

  async saveMany(data: (AnamnesisDTO & { userId: string })[]): Promise<void> {
    await this.knex(ETableNames.ANAMNESIS).insert(data);
  }

  async update(
    { patientId, ...data }: AnamnesisDTO,
    userId: string,
  ): Promise<void> {
    await this.knex(ETableNames.ANAMNESIS).update(data).where({ patientId, userId });
  }

  async get(patientId: string, userId: string): Promise<AnamnesisDTO> {
    const result = await this.knex(ETableNames.ANAMNESIS)
      .first("*")
      .where({ patientId, userId });

    const underwentSurgery = result ? result.underwentSurgery == 1 : undefined;
    const useMedicine = result ? result.useMedicine == 1 : undefined;

    return getValidObjectValues({
      ...result,
      underwentSurgery,
      useMedicine,
    });
  }
}

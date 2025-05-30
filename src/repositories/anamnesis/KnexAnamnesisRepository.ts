/* eslint-disable eqeqeq */
import { IAnamnesisRepository } from "./IAnamnesisRepository";
import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";

export class KnexAnamnesisRepository implements IAnamnesisRepository {
  async save(
    { patientId, ...data }: AnamnesisDTO,
    userId: string,
  ): Promise<void> {
    return await Knex(ETableNames.ANAMNESIS).insert({
      ...data,
      userId,
      patientId,
    });
  }

  async saveMany(data: (AnamnesisDTO & { userId: string })[]): Promise<void> {
    await Knex(ETableNames.ANAMNESIS).insert(data);
  }

  async update(
    { patientId, ...data }: AnamnesisDTO,
    userId: string,
  ): Promise<void> {
    await Knex(ETableNames.ANAMNESIS).update(data).where({ patientId, userId });
  }

  async get(patientId: string, userId: string): Promise<AnamnesisDTO> {
    const result = await Knex(ETableNames.ANAMNESIS)
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

/* eslint-disable eqeqeq */
import { query } from "../../database/mySqlConnection";
import { IAnamnesisRepository } from "./IAnamnesisRepository";
import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";

export class MySqlAnamnesisRepository implements IAnamnesisRepository {
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
    await Knex(ETableNames.ANAMNESIS)
      .update(data)
      .update(data)
      .where({ patientId, userId });
  }

  async get(patientId: string, userId: string): Promise<AnamnesisDTO[]> {
    const result = await Knex(ETableNames.PATIENTS)
      .select("*")
      .where({ patientId, userId });
    return result.map((anamnesis) =>
      getValidObjectValues({
        ...anamnesis,
        underwentSurgery: anamnesis.underwentSurgery == 1,
        useMedicine: anamnesis.useMedicine == 1,
      }),
    );
  }
}

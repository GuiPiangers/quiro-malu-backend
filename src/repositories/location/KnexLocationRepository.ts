import { ILocationRepository } from "./ILocationRepository";
import { LocationDTO } from "../../core/shared/Location";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { ETableNames } from "../../database/ETableNames";
import type { Knex } from "knex";

export class KnexLocationRepository implements ILocationRepository {
  constructor(private readonly knex: Knex) {}

  async save(
    data: LocationDTO,
    patientId: string,
    userId: string,
  ): Promise<void> {
    return await this.knex(ETableNames.LOCATIONS).insert({
      ...data,
      clinicId: userId,
      patientId,
    });
  }

  async saveMany(
    data: (LocationDTO & { patientId: string; userId: string })[],
  ): Promise<void> {
    await this.knex(ETableNames.LOCATIONS).insert(
      data.map(({ userId, ...location }) => ({
        ...location,
        clinicId: userId,
      })),
    );
  }

  async update(
    data: LocationDTO,
    patientId: string,
    userId: string,
  ): Promise<void> {
    await this.knex(ETableNames.LOCATIONS).update(data).where({
      patientId,
      clinicId: userId,
    });
  }

  async getLocation(patientId: string, userId: string): Promise<LocationDTO[]> {
    const result = await this.knex(ETableNames.LOCATIONS).select("*").where({
      clinicId: userId,
      patientId,
    });

    return result.map((res) => getValidObjectValues(res));
  }
}

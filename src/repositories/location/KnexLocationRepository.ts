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
    clinicId: string,
  ): Promise<void> {
    return await this.knex(ETableNames.LOCATIONS).insert({
      ...data,
      clinicId: clinicId,
      patientId,
    });
  }

  async saveMany(
    data: (LocationDTO & { patientId: string; clinicId: string })[],
  ): Promise<void> {
    await this.knex(ETableNames.LOCATIONS).insert(
      data.map(({ clinicId, ...location }) => ({
        ...location,
        clinicId: clinicId,
      })),
    );
  }

  async update(
    data: LocationDTO,
    patientId: string,
    clinicId: string,
  ): Promise<void> {
    await this.knex(ETableNames.LOCATIONS).update(data).where({
      patientId,
      clinicId: clinicId,
    });
  }

  async getLocation(patientId: string, clinicId: string): Promise<LocationDTO[]> {
    const result = await this.knex(ETableNames.LOCATIONS).select("*").where({
      clinicId: clinicId,
      patientId,
    });

    return result.map((res) => getValidObjectValues(res));
  }
}

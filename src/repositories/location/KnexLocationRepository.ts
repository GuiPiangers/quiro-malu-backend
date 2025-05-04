import { ILocationRepository } from "./ILocationRepository";
import { LocationDTO } from "../../core/shared/Location";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";

export class KnexLocationRepository implements ILocationRepository {
  async save(
    data: LocationDTO,
    patientId: string,
    userId: string,
  ): Promise<void> {
    return await Knex(ETableNames.LOCATIONS).insert({
      ...data,
      userId,
      patientId,
    });
  }

  async saveMany(
    data: (LocationDTO & { patientId: string; userId: string })[],
  ): Promise<void> {
    await Knex(ETableNames.LOCATIONS).insert(data);
  }

  async update(
    data: LocationDTO,
    patientId: string,
    userId: string,
  ): Promise<void> {
    await Knex(ETableNames.LOCATIONS).update(data).where({
      patientId,
      userId,
    });
  }

  async getLocation(patientId: string, userId: string): Promise<LocationDTO[]> {
    const result = await Knex(ETableNames.LOCATIONS).select("*").where({
      userId,
      patientId,
    });

    return result.map((res) => getValidObjectValues(res));
  }
}

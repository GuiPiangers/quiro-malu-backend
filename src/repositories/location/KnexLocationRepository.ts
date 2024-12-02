import { query } from "../../database/mySqlConnection";
import { ILocationRepository } from "./ILocationRepository";
import { LocationDTO } from "../../core/shared/Location";
import { getValidObjectValues } from "../../utils/getValidObjectValues";
import { Knex } from "../../database";
import { ETableNames } from "../../database/ETableNames";

export class KnexLocationRepository implements ILocationRepository {
  save(data: LocationDTO, patientId: string, userId: string): Promise<void> {
    const sql = "INSERT INTO locations SET ?";
    const errorMessage = "Falha ao adicionar o usuário";

    return query(errorMessage, sql, {
      ...getValidObjectValues(data),
      state: data.state,
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
    const result = await Knex(ETableNames.LOCATIONS).update(data).where({
      patientId,
      userId,
    });
  }

  async getLocation(patientId: string, userId: string): Promise<LocationDTO[]> {
    const sql = "SELECT * FROM locations WHERE patientId = ? and userId = ?";
    const errorMessage = `Não foi possível realizar a busca`;
    const result = await query<LocationDTO[]>(errorMessage, sql, [
      patientId,
      userId,
    ]);

    return result.map((location) => getValidObjectValues(location));
  }
}

import type { Knex } from "knex";
import { randomUUID } from "node:crypto";
import { Clinician } from "../../core/clinician/models/Clinician";
import type { ServiceDTO } from "../../core/service/models/Service";
import { ETableNames } from "../../database/ETableNames";
import type {
  ClinicianFindByIdParams,
  IClinicianRepository,
} from "./IClinicianRepository";

async function loadServicesForClinicians(
  knex: Knex,
  clinicianIds: string[],
  clinicId: string,
): Promise<Map<string, ServiceDTO[]>> {
  const byClinician = new Map<string, ServiceDTO[]>();
  if (clinicianIds.length === 0) return byClinician;

  const rows = await knex(`${ETableNames.CLINICIAN_SERVICES} as cs`)
    .innerJoin(`${ETableNames.SERVICES} as s`, "s.id", "cs.serviceId")
    .whereIn("cs.clinicianId", clinicianIds)
    .where("s.clinicId", clinicId)
    .select(
      "cs.clinicianId",
      "s.id",
      "s.name",
      "s.value",
      "s.duration",
    );

  for (const row of rows) {
    const list = byClinician.get(row.clinicianId) ?? [];
    list.push({
      id: row.id,
      name: row.name,
      value: row.value,
      duration: row.duration,
    });
    byClinician.set(row.clinicianId, list);
  }

  return byClinician;
}

export class KnexClinicianRepository implements IClinicianRepository {
  constructor(private readonly knex: Knex) {}

  async findById(params: ClinicianFindByIdParams): Promise<Clinician | null> {
    const row = await this.knex(`${ETableNames.USERS} as u`)
      .leftJoin(`${ETableNames.CLINICIANS} as c`, "c.id", "u.id")
      .where("u.id", params.id)
      .where("u.clinicId", params.clinicId)
      .whereNotNull("c.id")
      .select(
        "u.id",
        "u.name",
        "u.email",
        "u.phone",
        "u.password",
        "u.clinicId",
        "u.roleId",
      )
      .first();

    if (!row) return null;

    const servicesByClinician = await loadServicesForClinicians(
      this.knex,
      [params.id],
      params.clinicId,
    );

    return new Clinician({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      password: row.password,
      clinicId: row.clinicId,
      roleId: row.roleId ?? undefined,
      services: servicesByClinician.get(params.id) ?? [],
    });
  }

  async findByClinic(params: { clinicId: string }): Promise<Clinician[]> {
    const rows = await this.knex(`${ETableNames.USERS} as u`)
      .innerJoin(`${ETableNames.CLINICIANS} as c`, "c.id", "u.id")
      .where("u.clinicId", params.clinicId)
      .select(
        "u.id",
        "u.name",
        "u.email",
        "u.phone",
        "u.password",
        "u.clinicId",
        "u.roleId",
      );

    const ids = rows.map((r) => r.id);
    if (ids.length === 0) return [];

    const servicesByClinician = await loadServicesForClinicians(
      this.knex,
      ids,
      params.clinicId,
    );

    return rows.map(
      (row) =>
        new Clinician({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          password: row.password,
          clinicId: row.clinicId,
          roleId: row.roleId ?? undefined,
          services: servicesByClinician.get(row.id) ?? [],
        }),
    );
  }

  async save(clinician: Clinician): Promise<void> {
    const userDTO = await clinician.getUserDTO();
    const { services = [] } = clinician.toClinicianDTO();

    await this.knex.transaction(async (trx) => {
      await trx(ETableNames.USERS).insert({
        id: userDTO.id,
        name: userDTO.name,
        email: userDTO.email,
        phone: userDTO.phone,
        password: userDTO.password,
        clinicId: userDTO.clinicId,
        roleId: userDTO.roleId ?? null,
      });

      await trx(ETableNames.CLINICIANS).insert({ id: clinician.id });

      if (services.length > 0) {
        await trx(ETableNames.CLINICIAN_SERVICES).insert(
          services.map((s) => ({
            id: randomUUID(),
            clinicianId: clinician.id,
            serviceId: s.id!,
          })),
        );
      }
    });
  }
}

import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../database/ETableNames'
import { Patient } from '../../core/patients/models/Patient'
import { Name } from '../../core/shared/Name'

/**
 * Valor como após `new Name(..., { compoundName: true })` em `Patient.name`.
 * Use em asserts de integração para acompanhar mudanças só em `Name.ts`.
 */
export function expectedPatientDisplayName(raw: string): string {
  return new Name(raw, { compoundName: true }).value
}

/**
 * Valor como após `new Name(...)` em campos de `Location` (address, city, state, neighborhood).
 */
export function expectedLocationDisplayField(raw: string): string {
  return new Name(raw).value
}

export function shouldRunPatientIntegrationSuite(): boolean {
  return (
    Boolean(
      process.env.DB_HOST &&
        process.env.MYSQL_ROOT_USER &&
        process.env.MYSQL_DATABASE,
    ) &&
    ['1', 'true', 'yes'].includes(
      String(process.env.RUN_INTEGRATION_TESTS ?? '').toLowerCase(),
    )
  )
}

export async function insertIntegrationUser(
  trx: Knex.Transaction,
): Promise<{ userId: string; clinicId: string }> {
  const userId = uuidv4()
  const clinicId = userId
  await trx(ETableNames.CLINICS).insert({
    id: clinicId,
    name: `Clinic ${clinicId}`,
  })
  await trx(ETableNames.USERS).insert({
    id: userId,
    clinicId,
    name: 'Integration user',
    email: `${userId}@integration.test`,
    password: 'not-used',
  })
  return { userId, clinicId }
}

/** Insere paciente com `hashData` coerente ao modelo de domínio. */
export async function insertPatientForIntegration(
  trx: Knex.Transaction,
  userId: string,
  input: {
    id?: string;
    name: string;
    phone: string;
    dateOfBirth?: string;
    cpf?: string;
  },
): Promise<{ patientId: string; hashData: string }> {
  const entity = new Patient({
    id: input.id,
    name: input.name,
    phone: input.phone,
    dateOfBirth: input.dateOfBirth,
    cpf: input.cpf,
  })
  const dto = entity.getPatientDTO()
  const patientId = entity.id

  await trx(ETableNames.PATIENTS).insert({
    id: patientId,
    userId,
    clinicId: userId,
    name: dto.name,
    phone: dto.phone,
    hashData: dto.hashData,
    dateOfBirth: dto.dateOfBirth ?? null,
    cpf: dto.cpf ?? null,
    gender: dto.gender ?? null,
    education: dto.education ?? null,
    profession: dto.profession ?? null,
    maritalStatus: dto.maritalStatus ?? null,
  })

  return { patientId, hashData: dto.hashData as string }
}

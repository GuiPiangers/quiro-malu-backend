import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../database/ETableNames'
import { createKnexForIntegrationTests } from '../../test/integration/knexTestConnection'
import { withRollbackTransaction } from '../../test/integration/transactionRollback'
import { KnexClinicianRepository } from './KnexClinicianRepository'

const integrationEnvReady = Boolean(
  process.env.DB_HOST &&
  process.env.MYSQL_ROOT_USER &&
  process.env.MYSQL_DATABASE,
)

const runIntegrationTests = ['1', 'true', 'yes'].includes(
  String(process.env.RUN_INTEGRATION_TESTS ?? '').toLowerCase(),
)

const shouldRunIntegrationSuite = integrationEnvReady && runIntegrationTests

async function insertUser(
  trx: Knex.Transaction,
  params: { clinicId: string; isClinician?: boolean },
) {
  const userId = uuidv4()
  await trx(ETableNames.USERS).insert({
    id: userId,
    clinicId: params.clinicId,
    name: 'Integration user',
    email: `${userId}@integration.test`,
    password: 'not-used',
  })

  if (params.isClinician) {
    await trx(ETableNames.CLINICIANS).insert({ id: userId })
  }

  return userId
}

async function insertClinic(trx: Knex.Transaction) {
  const clinicId = uuidv4()
  await trx(ETableNames.CLINICS).insert({
    id: clinicId,
    name: `Clinic ${clinicId}`,
  })
  return clinicId
}

describe.skipIf(!shouldRunIntegrationSuite)(
  'KnexClinicianRepository.findClinicianIdsInClinic (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna apenas IDs que são clínicos da clínica', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const clinicId = await insertClinic(trx)
        const clinicianA = await insertUser(trx, { clinicId, isClinician: true })
        const clinicianB = await insertUser(trx, { clinicId, isClinician: true })
        const plainUser = await insertUser(trx, { clinicId })

        const repo = new KnexClinicianRepository(trx)
        const found = await repo.findClinicianIdsInClinic({
          clinicId,
          userIds: [clinicianA, clinicianB, plainUser],
        })

        expect(found.sort()).toEqual([clinicianA, clinicianB].sort())
      })
    })

    it('ignora clínico de outra clínica', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const clinicA = await insertClinic(trx)
        const clinicB = await insertClinic(trx)
        const clinicianInA = await insertUser(trx, {
          clinicId: clinicA,
          isClinician: true,
        })

        const repo = new KnexClinicianRepository(trx)
        const found = await repo.findClinicianIdsInClinic({
          clinicId: clinicB,
          userIds: [clinicianInA],
        })

        expect(found).toEqual([])
      })
    })

    it('retorna array vazio quando userIds está vazio', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const clinicId = await insertClinic(trx)
        const repo = new KnexClinicianRepository(trx)

        const found = await repo.findClinicianIdsInClinic({
          clinicId,
          userIds: [],
        })

        expect(found).toEqual([])
      })
    })

    it('deduplica userIds na consulta', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const clinicId = await insertClinic(trx)
        const clinicianId = await insertUser(trx, {
          clinicId,
          isClinician: true,
        })

        const repo = new KnexClinicianRepository(trx)
        const found = await repo.findClinicianIdsInClinic({
          clinicId,
          userIds: [clinicianId, clinicianId],
        })

        expect(found).toEqual([clinicianId])
      })
    })
  },
)

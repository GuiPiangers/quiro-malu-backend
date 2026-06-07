import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../../database/ETableNames'
import { BlockScheduleRepository } from '../../../../../repositories/blockScheduleRepository/BlockScheduleRepository'
import { createKnexForIntegrationTests } from '../../../../../test/integration/knexTestConnection'
import { withRollbackTransaction } from '../../../../../test/integration/transactionRollback'
import { DeleteBlockScheduleUseCase } from './deleteBlockSchedule'

const integrationEnvReady = Boolean(
  process.env.DB_HOST &&
  process.env.MYSQL_ROOT_USER &&
  process.env.MYSQL_DATABASE,
)

const runIntegrationTests = ['1', 'true', 'yes'].includes(
  String(process.env.RUN_INTEGRATION_TESTS ?? '').toLowerCase(),
)

const shouldRunIntegrationSuite = integrationEnvReady && runIntegrationTests

async function insertUserAndPatient(trx: Knex.Transaction) {
  const userId = uuidv4()
  const patientId = uuidv4()
  await trx(ETableNames.CLINICS).insert({
    id: userId,
    name: `Clinic ${userId}`,
  })
  await trx(ETableNames.USERS).insert({
    id: userId,
    clinicId: userId,
    name: 'Integration user',
    email: `${userId}@integration.test`,
    password: 'not-used',
  })
  await trx(ETableNames.PATIENTS).insert({
    id: patientId,
    name: 'Integration patient',
    userId,
    clinicId: userId,
  })
  return { userId, patientId }
}

describe.skipIf(!shouldRunIntegrationSuite)(
  'DeleteBlockScheduleUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('remove o bloqueio quando id e userId conferem', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        const blockId = uuidv4()
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: blockId,
          userId,
          startDate: '2038-06-01T08:00:00',
          endDate: '2038-06-01T12:00:00',
          description: 'Remover',
        })

        const useCase = new DeleteBlockScheduleUseCase(
          new BlockScheduleRepository(trx),
        )

        await useCase.execute({
          id: blockId,
          requestUserId: userId,
          eventsWriteScope: { type: 'all' },
        })

        const row = await trx(ETableNames.BLOCK_SCHEDULES)
          .where({ id: blockId, userId })
          .first()

        expect(row).toBeUndefined()
      })
    })

    it('não remove bloqueio de outro usuário', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const owner = await insertUserAndPatient(trx)
        const other = await insertUserAndPatient(trx)
        const blockId = uuidv4()

        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: blockId,
          userId: owner.userId,
          startDate: '2038-06-02T09:00:00',
          endDate: '2038-06-02T10:00:00',
          description: 'Dono',
        })

        const useCase = new DeleteBlockScheduleUseCase(
          new BlockScheduleRepository(trx),
        )

        await expect(
          useCase.execute({
            id: blockId,
            requestUserId: other.userId,
            eventsWriteScope: { type: 'own' },
          }),
        ).rejects.toMatchObject({ statusCode: 403 })

        const row = await trx(ETableNames.BLOCK_SCHEDULES)
          .where({ id: blockId, userId: owner.userId })
          .first()

        expect(row).toBeDefined()
      })
    })
  },
)

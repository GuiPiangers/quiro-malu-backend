import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../../database/ETableNames'
import { BlockScheduleRepository } from '../../../../../repositories/blockScheduleRepository/BlockScheduleRepository'
import { createKnexForIntegrationTests } from '../../../../../test/integration/knexTestConnection'
import { withRollbackTransaction } from '../../../../../test/integration/transactionRollback'
import { ListBlockSchedulingUseCase } from './ListBlockSchedulingUseCase'

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
  'ListBlockSchedulingUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna bloqueios que intersectam o intervalo solicitado', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        const other = await insertUserAndPatient(trx)

        const idA = uuidv4()
        const idB = uuidv4()
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: idA,
          userId,
          startDate: '2038-04-01T08:00:00',
          endDate: '2038-04-01T10:00:00',
          description: 'A',
        })
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: idB,
          userId,
          startDate: '2038-04-02T14:00:00',
          endDate: '2038-04-02T16:00:00',
          description: 'B',
        })
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: uuidv4(),
          userId: other.userId,
          startDate: '2038-04-01T09:00:00',
          endDate: '2038-04-01T11:00:00',
          description: 'Outro user',
        })

        const useCase = new ListBlockSchedulingUseCase(
          new BlockScheduleRepository(trx),
        )

        const result = await useCase.execute({
          userId,
          requestUserId: userId,
          startDate: '2038-04-01T07:00',
          endDate: '2038-04-02T15:00',
        })

        const ids = result.map((r) => r.id).sort()
        expect(ids).toEqual([idA, idB].sort())
        expect(result.every((r) => typeof r.date === 'string')).toBe(true)
      })
    })

    it('rejeita quando startDate >= endDate', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        const useCase = new ListBlockSchedulingUseCase(
          new BlockScheduleRepository(trx),
        )

        await expect(
          useCase.execute({
            userId,
            requestUserId: userId,
            startDate: '2038-05-01T12:00',
            endDate: '2038-05-01T12:00',
          }),
        ).rejects.toMatchObject({
          statusCode: 400,
          type: 'INVALID_DATE_RANGE',
        })
      })
    })
  },
)

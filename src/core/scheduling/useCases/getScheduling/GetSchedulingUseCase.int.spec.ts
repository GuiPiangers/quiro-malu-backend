import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../database/ETableNames'
import { KnexSchedulingRepository } from '../../../../repositories/scheduling/KnexSchedulingRepository'
import { createKnexForIntegrationTests } from '../../../../test/integration/knexTestConnection'
import { withRollbackTransaction } from '../../../../test/integration/transactionRollback'
import { GetSchedulingUseCase } from './GetSchedulingUseCase'

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
  'GetSchedulingUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna a data como a mesma string canônica YYYY-MM-DDTHH:mm do agendamento gravado', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx)
        const scheduleId = uuidv4()
        const storedLocalDateTime = '2030-10-05T14:25:00'

        await trx(ETableNames.SCHEDULES).insert({
          id: scheduleId,
          userId,
          clinicId: userId,
          patientId,
          date: storedLocalDateTime,
          duration: 3600,
          status: 'Agendado',
          service: 'Consulta',
        })

        const useCase = new GetSchedulingUseCase(
          new KnexSchedulingRepository(trx),
        )

        const result = await useCase.execute({
          clinicId: userId,
          id: scheduleId,
          requestUserId: userId,
        })

        expect(result.date).toBe('2030-10-05T14:25')
        expect(typeof result.date).toBe('string')
        expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
      })
    })

    it('mantém consistência da string para outro horário gravado', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx)
        const scheduleId = uuidv4()
        const storedLocalDateTime = '2031-01-01T09:00:00'

        await trx(ETableNames.SCHEDULES).insert({
          id: scheduleId,
          userId,
          clinicId: userId,
          patientId,
          date: storedLocalDateTime,
          duration: 1800,
          status: 'Agendado',
          service: 'Avaliação',
        })

        const useCase = new GetSchedulingUseCase(
          new KnexSchedulingRepository(trx),
        )

        const result = await useCase.execute({
          clinicId: userId,
          id: scheduleId,
          requestUserId: userId,
        })

        expect(result.date).toBe('2031-01-01T09:00')
      })
    })
  },
)

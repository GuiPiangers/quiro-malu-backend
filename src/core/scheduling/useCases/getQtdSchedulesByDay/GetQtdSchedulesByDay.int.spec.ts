import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../database/ETableNames'
import { KnexSchedulingRepository } from '../../../../repositories/scheduling/KnexSchedulingRepository'
import { createKnexForIntegrationTests } from '../../../../test/integration/knexTestConnection'
import { withRollbackTransaction } from '../../../../test/integration/transactionRollback'
import { GetQtdSchedulesByDay } from './GetQtdSchedulesByDay'

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

async function insertSchedule(
  trx: Knex.Transaction,
  row: {
    id: string
    userId: string
    patientId: string
    date: string
    duration: number
    status: string
    service: string
  },
) {
  await trx(ETableNames.SCHEDULES).insert({
    id: row.id,
    userId: row.userId,
    clinicId: row.userId,
    patientId: row.patientId,
    date: row.date,
    duration: row.duration,
    status: row.status,
    service: row.service,
  })
}

function sortByDate(
  rows: { date: string; qtd: number }[],
): { date: string; qtd: number }[] {
  return [...rows].sort((a, b) => a.date.localeCompare(b.date))
}

describe.skipIf(!shouldRunIntegrationSuite)(
  'GetQtdSchedulesByDay (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna apenas contagens do mês e ano solicitados (por dia)', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx)

        const base = {
          userId,
          patientId,
          duration: 3600,
          status: 'Agendado',
          service: 'Consulta',
        }

        await insertSchedule(trx, {
          ...base,
          id: uuidv4(),
          date: '2031-03-05T09:00:00',
        })
        await insertSchedule(trx, {
          ...base,
          id: uuidv4(),
          date: '2031-03-05T14:00:00',
        })
        await insertSchedule(trx, {
          ...base,
          id: uuidv4(),
          date: '2031-03-05T16:30:00',
        })
        await insertSchedule(trx, {
          ...base,
          id: uuidv4(),
          date: '2031-03-10T11:00:00',
        })

        await insertSchedule(trx, {
          ...base,
          id: uuidv4(),
          date: '2031-04-05T10:00:00',
        })
        await insertSchedule(trx, {
          ...base,
          id: uuidv4(),
          date: '2030-03-20T10:00:00',
        })

        const useCase = new GetQtdSchedulesByDay(
          new KnexSchedulingRepository(trx),
        )

        const result = sortByDate(
          await useCase.execute({
            clinicId: userId,
            userId,
            month: 3,
            year: 2031,
          }),
        )

        expect(result).toEqual([
          { date: '2031-03-05', qtd: 3 },
          { date: '2031-03-10', qtd: 1 },
        ])

        for (const row of result) {
          expect(row.date).toMatch(/^2031-03-\d{2}$/)
        }
      })
    })

    it('não inclui agendamentos de outros usuários no mesmo mês/ano', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const owner = await insertUserAndPatient(trx)
        const other = await insertUserAndPatient(trx)

        await insertSchedule(trx, {
          id: uuidv4(),
          userId: owner.userId,
          patientId: owner.patientId,
          date: '2032-06-01T08:00:00',
          duration: 3600,
          status: 'Agendado',
          service: 'A',
        })
        await insertSchedule(trx, {
          id: uuidv4(),
          userId: other.userId,
          patientId: other.patientId,
          date: '2032-06-01T15:00:00',
          duration: 3600,
          status: 'Agendado',
          service: 'B',
        })
        await insertSchedule(trx, {
          id: uuidv4(),
          userId: other.userId,
          patientId: other.patientId,
          date: '2032-06-01T16:00:00',
          duration: 3600,
          status: 'Agendado',
          service: 'C',
        })

        const useCase = new GetQtdSchedulesByDay(
          new KnexSchedulingRepository(trx),
        )

        const result = await useCase.execute({
          clinicId: owner.userId,
          userId: owner.userId,
          month: 6,
          year: 2032,
        })

        expect(result).toEqual([{ date: '2032-06-01', qtd: 1 }])
      })
    })

    it('retorna lista vazia quando não há agendamentos naquele mês/ano', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx)

        await insertSchedule(trx, {
          id: uuidv4(),
          userId,
          patientId,
          date: '2033-01-10T10:00:00',
          duration: 3600,
          status: 'Agendado',
          service: 'X',
        })

        const useCase = new GetQtdSchedulesByDay(
          new KnexSchedulingRepository(trx),
        )

        const result = await useCase.execute({
          clinicId: userId,
          userId,
          month: 2,
          year: 2033,
        })

        expect(result).toEqual([])
      })
    })
  },
)

import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../database/ETableNames'
import { BlockScheduleRepository } from '../../../../repositories/blockScheduleRepository/BlockScheduleRepository'
import { KnexSchedulingRepository } from '../../../../repositories/scheduling/KnexSchedulingRepository'
import { createKnexForIntegrationTests } from '../../../../test/integration/knexTestConnection'
import { withRollbackTransaction } from '../../../../test/integration/transactionRollback'
import { ListEventsUseCase } from './ListEventsUseCase'
import { BlockScheduleDto } from '../../models/dtos/BlockSchedule.dto'
import type { SchedulingWithPatientDTO } from '../../models/SchedulingWithPatient'

type ListEventRow = SchedulingWithPatientDTO | BlockScheduleDto

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

function createListEventsUseCase(trx: Knex.Transaction) {
  return new ListEventsUseCase(
    new KnexSchedulingRepository(trx),
    new BlockScheduleRepository(trx),
  )
}

describe.skipIf(!shouldRunIntegrationSuite)(
  'ListEventsUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna lista vazia quando não há agendamentos nem bloqueios no dia', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        const useCase = createListEventsUseCase(trx)

        const result = await useCase.execute({
          userId,
          clinicId: userId,
          date: '2038-01-10',
        })

        expect(result.data).toEqual([])
      })
    })

    it('retorna agendamentos do usuário na data (com dados do paciente)', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx)
        const scheduleId = uuidv4()
        await trx(ETableNames.SCHEDULES).insert({
          id: scheduleId,
          userId,
          clinicId: userId,
          patientId,
          date: '2038-02-15T09:15:00',
          duration: 1800,
          service: 'Consulta',
          status: 'Agendado',
        })

        const useCase = createListEventsUseCase(trx)
        const { data } = await useCase.execute({
          userId,
          clinicId: userId,
          date: '2038-02-15',
        })

        expect(data).toHaveLength(1)
        const row = data[0] as ListEventRow
        expect('patientId' in row && row.patientId === patientId).toBe(true)
        if ('patientId' in row) {
          expect(row.id).toBe(scheduleId)
          expect(row.patient).toBe('Integration patient')
          expect(row.service).toBe('Consulta')
          expect(row.status).toBe('Agendado')
          expect(String(row.date)).toContain('2038-02-15T09:15')
        }
      })
    })

    it('retorna bloqueios que intersectam o dia solicitado', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        const blockId = uuidv4()
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: blockId,
          userId,
          startDate: '2038-03-20T08:00:00',
          endDate: '2038-03-20T12:00:00',
          description: 'Treino',
        })

        const useCase = createListEventsUseCase(trx)
        const { data } = await useCase.execute({
          userId,
          clinicId: userId,
          date: '2038-03-20',
        })

        expect(data).toHaveLength(1)
        const row = data[0] as ListEventRow
        expect(
          'description' in row &&
            row.description === 'Treino' &&
            !('patientId' in row),
        ).toBe(true)
        if ('description' in row && !('patientId' in row)) {
          expect(row.id).toBe(blockId)
          expect(String(row.date)).toContain('2038-03-20T08:00')
          expect(String(row.endDate)).toContain('2038-03-20T12:00')
        }
      })
    })

    it('combina agendamentos e bloqueios ordenados pelo comparador do use case', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx)
        const scheduleId = uuidv4()
        const blockId = uuidv4()

        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: blockId,
          userId,
          startDate: '2038-04-01T10:00:00',
          endDate: '2038-04-01T11:00:00',
          description: 'Manhã',
        })
        await trx(ETableNames.SCHEDULES).insert({
          id: scheduleId,
          userId,
          clinicId: userId,
          patientId,
          date: '2038-04-01T12:00:00',
          duration: 3600,
          service: 'Sessão',
          status: 'Agendado',
        })

        const useCase = createListEventsUseCase(trx)
        const { data } = await useCase.execute({
          userId,
          clinicId: userId,
          date: '2038-04-01',
        })

        expect(data).toHaveLength(2)
        const first = data[0] as ListEventRow
        const second = data[1] as ListEventRow
        expect(
          'description' in first &&
            first.description === 'Manhã' &&
            !('patientId' in first),
        ).toBe(true)
        expect('patientId' in second && second.service === 'Sessão').toBe(
          true,
        )
        if ('description' in first && !('patientId' in first)) {
          expect(first.id).toBe(blockId)
        }
        if ('patientId' in second) {
          expect(second.id).toBe(scheduleId)
        }
      })
    })

    it('não retorna eventos de outro usuário na mesma data', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const a = await insertUserAndPatient(trx)
        const b = await insertUserAndPatient(trx)

        await trx(ETableNames.SCHEDULES).insert({
          id: uuidv4(),
          userId: a.userId,
          clinicId: a.userId,
          patientId: a.patientId,
          date: '2038-05-01T10:00:00',
          duration: 3600,
          service: 'A',
          status: 'Agendado',
        })
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: uuidv4(),
          userId: a.userId,
          startDate: '2038-05-01T14:00:00',
          endDate: '2038-05-01T15:00:00',
          description: 'Bloqueio A',
        })

        await trx(ETableNames.SCHEDULES).insert({
          id: uuidv4(),
          userId: b.userId,
          clinicId: b.userId,
          patientId: b.patientId,
          date: '2038-05-01T11:00:00',
          duration: 3600,
          service: 'B',
          status: 'Agendado',
        })
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: uuidv4(),
          userId: b.userId,
          startDate: '2038-05-01T16:00:00',
          endDate: '2038-05-01T17:00:00',
          description: 'Bloqueio B',
        })

        const useCase = createListEventsUseCase(trx)
        const { data } = await useCase.execute({
          userId: b.userId,
          clinicId: b.userId,
          date: '2038-05-01',
        })

        expect(data).toHaveLength(2)
        expect(
          data.every((row) => {
            const r = row as ListEventRow
            return (
              ('service' in r && r.service === 'B') ||
              ('description' in r && r.description === 'Bloqueio B')
            )
          }),
        ).toBe(true)
      })
    })

    it('usa apenas a parte da data ao consultar bloqueios quando o payload inclui hora', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: uuidv4(),
          userId,
          startDate: '2038-06-10T08:00:00',
          endDate: '2038-06-10T09:30:00',
          description: 'Com hora no filtro',
        })

        const useCase = createListEventsUseCase(trx)
        const { data } = await useCase.execute({
          userId,
          clinicId: userId,
          date: '2038-06-10T07:00:00',
        })

        expect(data).toHaveLength(1)
        const row = data[0] as ListEventRow
        expect(
          'description' in row &&
            row.description === 'Com hora no filtro' &&
            !('patientId' in row),
        ).toBe(true)
      })
    })
  },
)

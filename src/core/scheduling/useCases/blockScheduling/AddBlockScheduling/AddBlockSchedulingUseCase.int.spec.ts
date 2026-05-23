import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../../database/ETableNames'
import { BlockScheduleRepository } from '../../../../../repositories/blockScheduleRepository/BlockScheduleRepository'
import { KnexSchedulingRepository } from '../../../../../repositories/scheduling/KnexSchedulingRepository'
import { ApiError } from '../../../../../utils/ApiError'
import { createKnexForIntegrationTests } from '../../../../../test/integration/knexTestConnection'
import { withRollbackTransaction } from '../../../../../test/integration/transactionRollback'
import { AppEventListener } from '../../../../shared/observers/EventListener'
import { AddBlockSchedulingUseCase } from './AddBlockSchedulingUseCase'

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
  'AddBlockSchedulingUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('persiste o bloqueio e emite createBlockSchedule', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        const blockRepo = new BlockScheduleRepository(trx)
        const events = new AppEventListener()
        const useCase = new AddBlockSchedulingUseCase(
          blockRepo,
          new KnexSchedulingRepository(trx),
          events,
        )

        const listener = vi.fn().mockResolvedValue(undefined)
        events.on('createBlockSchedule', listener)
        const emitSpy = vi.spyOn(events, 'emit')

        await useCase.execute({
          userId,
          clinicId: userId,
          date: '2038-02-01T08:00',
          endDate: '2038-02-01T09:00',
          description: 'Treinamento',
        })

        const rows = await trx(ETableNames.BLOCK_SCHEDULES).where({ userId })
        expect(rows).toHaveLength(1)
        expect(rows[0]?.description).toBe('Treinamento')

        expect(emitSpy).toHaveBeenCalledWith(
          'createBlockSchedule',
          expect.objectContaining({
            userId,
            description: 'Treinamento',
            date: '2038-02-01T08:00',
            endDate: '2038-02-01T09:00',
          }),
        )
        expect(listener).toHaveBeenCalledTimes(1)
      })
    })

    it('rejeita quando existe agendamento sobreposto ao intervalo', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, patientId } = await insertUserAndPatient(trx)
        await trx(ETableNames.SCHEDULES).insert({
          id: uuidv4(),
          userId,
          clinicId: userId,
          patientId,
          date: '2038-02-10T10:30:00',
          duration: 3600,
          status: 'Agendado',
          service: 'Consulta',
        })

        const useCase = new AddBlockSchedulingUseCase(
          new BlockScheduleRepository(trx),
          new KnexSchedulingRepository(trx),
          new AppEventListener(),
        )

        await expect(
          useCase.execute({
            userId,
            clinicId: userId,
            date: '2038-02-10T10:00',
            endDate: '2038-02-10T12:00',
            description: 'Bloqueio',
          }),
        ).rejects.toBeInstanceOf(ApiError)

        const count = await trx(ETableNames.BLOCK_SCHEDULES)
          .where({ userId })
          .count('id as c')
          .first()
        expect(Number((count as { c: number | string }).c)).toBe(0)
      })
    })

    it('rejeita quando já existe outro bloqueio sobreposto', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertUserAndPatient(trx)
        const existingId = uuidv4()
        await trx(ETableNames.BLOCK_SCHEDULES).insert({
          id: existingId,
          userId,
          startDate: '2038-02-11T08:00:00',
          endDate: '2038-02-11T18:00:00',
          description: 'Folga',
        })

        const useCase = new AddBlockSchedulingUseCase(
          new BlockScheduleRepository(trx),
          new KnexSchedulingRepository(trx),
          new AppEventListener(),
        )

        await expect(
          useCase.execute({
            userId,
            clinicId: userId,
            date: '2038-02-11T10:00',
            endDate: '2038-02-11T11:00',
            description: 'Conflito',
          }),
        ).rejects.toThrow(
          /Existe agendamentos marcados no horário que deseja bloquear/,
        )

        const rows = await trx(ETableNames.BLOCK_SCHEDULES).where({ userId })
        expect(rows).toHaveLength(1)
      })
    })
  },
)

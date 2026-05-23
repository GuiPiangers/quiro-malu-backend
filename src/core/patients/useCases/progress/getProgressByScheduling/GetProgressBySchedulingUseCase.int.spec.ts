import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../../database/ETableNames'
import { KnexProgressRepository } from '../../../../../repositories/progress/KnexProgressRepository'
import { ApiError } from '../../../../../utils/ApiError'
import { createKnexForIntegrationTests } from '../../../../../test/integration/knexTestConnection'
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from '../../../../../test/integration/patientIntegrationHelpers'
import { withRollbackTransaction } from '../../../../../test/integration/transactionRollback'
import { GetProgressBySchedulingUseCase } from './GetProgressBySchedulingUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'GetProgressBySchedulingUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna evolução vinculada ao agendamento', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Progresso Por Agenda',
          phone: '(51) 90000 8888',
        })
        const schedulingId = uuidv4()
        await trx(ETableNames.SCHEDULES).insert({
          id: schedulingId,
          userId,
          clinicId: userId,
          patientId,
          date: '2038-06-01 10:00:00',
          duration: 3600,
          service: 'Consulta',
          status: 'Agendado',
        })
        const progressId = uuidv4()
        await trx(ETableNames.PROGRESS).insert({
          id: progressId,
          patientId,
          userId,
          clinicId: userId,
          service: 'Evolução agenda',
          schedulingId,
          date: '2038-06-01 11:00:00',
        })

        const useCase = new GetProgressBySchedulingUseCase(
          new KnexProgressRepository(trx),
        )
        const dto = await useCase.execute({
          schedulingId,
          patientId,
          clinicId: userId,
        })

        expect(dto.id).toBe(progressId)
        expect(dto.schedulingId).toBe(schedulingId)
      })
    })

    it('lança 404 quando não há evolução para o agendamento', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Progresso Por Agenda 404',
          phone: '(51) 90000 7777',
        })

        const useCase = new GetProgressBySchedulingUseCase(
          new KnexProgressRepository(trx),
        )
        await expect(
          useCase.execute({
            schedulingId: uuidv4(),
            patientId,
            clinicId: userId,
          }),
        ).rejects.toBeInstanceOf(ApiError)
      })
    })
  },
)

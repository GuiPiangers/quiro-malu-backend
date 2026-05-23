import { v4 as uuidv4 } from 'uuid'
import type { Knex } from 'knex'
import { ETableNames } from '../../../../../database/ETableNames'
import { KnexProgressRepository } from '../../../../../repositories/progress/KnexProgressRepository'
import { createKnexForIntegrationTests } from '../../../../../test/integration/knexTestConnection'
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from '../../../../../test/integration/patientIntegrationHelpers'
import { withRollbackTransaction } from '../../../../../test/integration/transactionRollback'
import { SetProgressUseCase } from './SetProgressUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'SetProgressUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('insere evolução quando não existe registro com o id', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Progresso Novo',
          phone: '(51) 94444 0001',
        })
        const progressId = uuidv4()

        const useCase = new SetProgressUseCase(new KnexProgressRepository(trx))
        await useCase.execute({
          id: progressId,
          userId,
          patientId,
          clinicId: userId,
          service: 'Quiropraxia',
          date: '2038-01-10T09:00',
          actualProblem: 'Dor',
          procedures: 'Ajuste',
        })

        const row = await trx(ETableNames.PROGRESS)
          .where({ id: progressId, patientId, clinicId: userId })
          .first()
        expect(row?.service).toBe('Quiropraxia')
        expect(row?.actualProblem).toBe('Dor')
      })
    })

    it('atualiza evolução quando já existe o mesmo id', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Progresso Update',
          phone: '(51) 94444 0002',
        })
        const progressId = uuidv4()
        await trx(ETableNames.PROGRESS).insert({
          id: progressId,
          patientId,
          userId,
          clinicId: userId,
          service: 'Massagem',
          date: '2038-02-01 10:00:00',
        })

        const useCase = new SetProgressUseCase(new KnexProgressRepository(trx))
        await useCase.execute({
          id: progressId,
          userId,
          patientId,
          clinicId: userId,
          service: 'Massagem',
          actualProblem: 'Atualizado',
        })

        const row = await trx(ETableNames.PROGRESS)
          .where({ id: progressId, patientId, clinicId: userId })
          .first()
        expect(row?.actualProblem).toBe('Atualizado')
      })
    })
  },
)

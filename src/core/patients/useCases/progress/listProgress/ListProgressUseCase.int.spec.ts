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
import { ListProgressUseCase } from './ListProgressUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'ListProgressUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('lista evoluções do paciente com total', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Lista Progresso',
          phone: '(51) 92222 0001',
        })
        await trx(ETableNames.PROGRESS).insert({
          id: uuidv4(),
          patientId,
          userId,
          clinicId: userId,
          service: 'Sessão 1',
          date: '2038-04-01 08:00:00',
        })
        await trx(ETableNames.PROGRESS).insert({
          id: uuidv4(),
          patientId,
          userId,
          clinicId: userId,
          service: 'Sessão 2',
          date: '2038-04-02 08:00:00',
        })

        const useCase = new ListProgressUseCase(new KnexProgressRepository(trx))
        const result = await useCase.execute({
          patientId,
          clinicId: userId,
          page: 1,
        })

        expect(result.total).toBeGreaterThanOrEqual(2)
        expect(result.progress.length).toBeGreaterThanOrEqual(2)
        expect(result.limit).toBe(10)
      })
    })
  },
)

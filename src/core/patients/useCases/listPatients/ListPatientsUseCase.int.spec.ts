import type { Knex } from 'knex'
import { KnexPatientRepository } from '../../../../repositories/patient/KnexPatientRepository'
import { createKnexForIntegrationTests } from '../../../../test/integration/knexTestConnection'
import {
  expectedPatientDisplayName,
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from '../../../../test/integration/patientIntegrationHelpers'
import { withRollbackTransaction } from '../../../../test/integration/transactionRollback'
import { ListPatientsUseCase } from './ListPatientsUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'ListPatientsUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('lista pacientes do usuário com total e limite', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, clinicId } = await insertIntegrationUser(trx)
        const alfa = 'Alfa Integração Lista'
        const beta = 'Beta Integração Lista'
        await insertPatientForIntegration(trx, userId, {
          name: alfa,
          phone: '(51) 93333 2222',
        })
        await insertPatientForIntegration(trx, userId, {
          name: beta,
          phone: '(51) 92222 1111',
        })

        const useCase = new ListPatientsUseCase(new KnexPatientRepository(trx))
        const result = await useCase.execute({
          clinicId,
          page: 1,
          limit: 20,
        })

        expect(result.total).toBeGreaterThanOrEqual(2)
        expect(result.patients.length).toBeGreaterThanOrEqual(2)
        expect(result.limit).toBe(20)
        const names = result.patients.map((p) => p.name)
        expect(names).toContain(expectedPatientDisplayName(alfa))
        expect(names).toContain(expectedPatientDisplayName(beta))
      })
    })
  },
)

import type { Knex } from 'knex'
import { KnexPatientRepository } from '../../../../repositories/patient/KnexPatientRepository'
import { ApiError } from '../../../../utils/ApiError'
import { createKnexForIntegrationTests } from '../../../../test/integration/knexTestConnection'
import {
  expectedPatientDisplayName,
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from '../../../../test/integration/patientIntegrationHelpers'
import { withRollbackTransaction } from '../../../../test/integration/transactionRollback'
import { GetPatientsByBirthDayUseCase } from './GetByBirthDayUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'GetPatientsByBirthDayUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna pacientes com aniversário no mês e dia informados (filtrado por userId)', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId, clinicId } = await insertIntegrationUser(trx)
        const other = await insertIntegrationUser(trx)

        await insertPatientForIntegration(trx, userId, {
          name: 'Ana Silva',
          phone: '(51) 91111 0000',
          dateOfBirth: '1990-03-15',
        })
        await insertPatientForIntegration(trx, other.userId, {
          name: 'Bruno Costa',
          phone: '(51) 90000 9999',
          dateOfBirth: '1988-03-15',
        })

        const useCase = new GetPatientsByBirthDayUseCase(
          new KnexPatientRepository(trx),
        )
        const rows = await useCase.execute({
          birthMonth: 3,
          birthDay: 15,
          clinicId,
        })

        expect(
          rows.some((r) => r.name === expectedPatientDisplayName('Ana Silva')),
        ).toBe(true)
        expect(
          rows.some(
            (r) => r.name === expectedPatientDisplayName('Bruno Costa'),
          ),
        ).toBe(false)
      })
    })

    it('rejeita birthMonth inválido', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const useCase = new GetPatientsByBirthDayUseCase(
          new KnexPatientRepository(trx),
        )
        await expect(
          useCase.execute({ birthMonth: 13, birthDay: 1, clinicId: 'any' }),
        ).rejects.toBeInstanceOf(ApiError)
      })
    })
  },
)

import type { Knex } from 'knex'
import { ETableNames } from '../../../../../database/ETableNames'
import { KnexDiagnosticRepository } from '../../../../../repositories/diagnostic/KnexDiagnosticRepository'
import { createKnexForIntegrationTests } from '../../../../../test/integration/knexTestConnection'
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from '../../../../../test/integration/patientIntegrationHelpers'
import { withRollbackTransaction } from '../../../../../test/integration/transactionRollback'
import { SetDiagnosticUseCase } from './SetDiagnosticUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'SetDiagnosticUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('insere diagnóstico quando ainda não existe', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Diag Novo',
          phone: '(51) 95555 0001',
        })

        const useCase = new SetDiagnosticUseCase(
          new KnexDiagnosticRepository(trx),
        )
        await useCase.execute(
          {
            patientId,
            diagnostic: 'Hernia discal',
            treatmentPlan: 'Repouso',
          },
          userId,
        )

        const row = await trx(ETableNames.DIAGNOSTICS)
          .where({ patientId, clinicId: userId })
          .first()
        expect(row?.diagnostic).toBe('Hernia discal')
      })
    })

    it('atualiza diagnóstico quando já existe', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Diag Update',
          phone: '(51) 95555 0002',
        })
        await trx(ETableNames.DIAGNOSTICS).insert({
          patientId,
          userId,
          clinicId: userId,
          diagnostic: 'Antigo',
          treatmentPlan: 'Antigo plano',
        })

        const useCase = new SetDiagnosticUseCase(
          new KnexDiagnosticRepository(trx),
        )
        await useCase.execute(
          {
            patientId,
            diagnostic: 'Novo quadro',
            treatmentPlan: 'Fisioterapia',
          },
          userId,
        )

        const row = await trx(ETableNames.DIAGNOSTICS)
          .where({ patientId, clinicId: userId })
          .first()
        expect(row?.diagnostic).toBe('Novo quadro')
        expect(row?.treatmentPlan).toBe('Fisioterapia')
      })
    })
  },
)

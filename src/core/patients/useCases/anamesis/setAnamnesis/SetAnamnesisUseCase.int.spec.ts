import type { Knex } from 'knex'
import { ETableNames } from '../../../../../database/ETableNames'
import { KnexAnamnesisRepository } from '../../../../../repositories/anamnesis/KnexAnamnesisRepository'
import { createKnexForIntegrationTests } from '../../../../../test/integration/knexTestConnection'
import {
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from '../../../../../test/integration/patientIntegrationHelpers'
import { withRollbackTransaction } from '../../../../../test/integration/transactionRollback'
import { SetAnamnesisUseCase } from './SetAnamnesisUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'SetAnamnesisUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('insere anamnese quando ainda não existe', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Novo Anamnese',
          phone: '(51) 97777 0001',
        })

        const useCase = new SetAnamnesisUseCase(new KnexAnamnesisRepository(trx))
        await useCase.execute(
          { patientId, mainProblem: 'Queixa principal' },
          userId,
        )

        const row = await trx(ETableNames.ANAMNESIS)
          .where({ patientId, clinicId: userId })
          .first()
        expect(row?.mainProblem).toBe('Queixa principal')
      })
    })

    it('atualiza anamnese quando já existe', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Update Anamnese',
          phone: '(51) 97777 0002',
        })
        await trx(ETableNames.ANAMNESIS).insert({
          patientId,
          userId,
          clinicId: userId,
          mainProblem: 'Antigo',
        })

        const useCase = new SetAnamnesisUseCase(new KnexAnamnesisRepository(trx))
        await useCase.execute(
          { patientId, mainProblem: 'Atualizado' },
          userId,
        )

        const row = await trx(ETableNames.ANAMNESIS)
          .where({ patientId, clinicId: userId })
          .first()
        expect(row?.mainProblem).toBe('Atualizado')
      })
    })
  },
)

import type { Knex } from 'knex'
import { ETableNames } from '../../../../database/ETableNames'
import { KnexLocationRepository } from '../../../../repositories/location/KnexLocationRepository'
import { KnexPatientRepository } from '../../../../repositories/patient/KnexPatientRepository'
import { createKnexForIntegrationTests } from '../../../../test/integration/knexTestConnection'
import {
  expectedPatientDisplayName,
  insertIntegrationUser,
  insertPatientForIntegration,
  shouldRunPatientIntegrationSuite,
} from '../../../../test/integration/patientIntegrationHelpers'
import { withRollbackTransaction } from '../../../../test/integration/transactionRollback'
import { GetPatientUseCase } from './GetPatientUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'GetPatientUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna paciente com localização quando existir', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const patientLabel = 'Paciente Com Local'
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: patientLabel,
          phone: '(51) 95555 4444',
        })
        await trx(ETableNames.LOCATIONS).insert({
          patientId,
          userId,
          clinicId: userId,
          address: 'Rua X',
          city: 'POA',
          state: 'RS',
        })

        const useCase = new GetPatientUseCase(
          new KnexPatientRepository(trx),
          new KnexLocationRepository(trx),
        )
        const result = await useCase.execute(patientId, userId)

        expect(result).toMatchObject({
          id: patientId,
          name: expectedPatientDisplayName(patientLabel),
        })
        expect('location' in result && result.location).toMatchObject({
          address: 'Rua X',
          city: 'POA',
        })
      })
    })

    it('retorna paciente sem chave location quando não houver endereço', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Paciente Sem Local',
          phone: '(51) 94444 3333',
        })

        const useCase = new GetPatientUseCase(
          new KnexPatientRepository(trx),
          new KnexLocationRepository(trx),
        )
        const result = await useCase.execute(patientId, userId)

        expect(result).toMatchObject({ id: patientId })
        expect('location' in result).toBe(false)
      })
    })
  },
)

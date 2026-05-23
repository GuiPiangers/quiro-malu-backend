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
import { GetProgressUseCase } from './GetProgressUseCase'

describe.skipIf(!shouldRunPatientIntegrationSuite())(
  'GetProgressUseCase (integration)',
  () => {
    let knex: Knex

    beforeAll(() => {
      knex = createKnexForIntegrationTests()
    })

    afterAll(async () => {
      await knex.destroy()
    })

    it('retorna DTO da evolução existente', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Get Progress',
          phone: '(51) 93333 0001',
        })
        const progressId = uuidv4()
        await trx(ETableNames.PROGRESS).insert({
          id: progressId,
          patientId,
          userId,
          clinicId: userId,
          service: 'Avaliação',
          date: '2038-03-05 11:00:00',
        })

        const useCase = new GetProgressUseCase(new KnexProgressRepository(trx))
        const dto = await useCase.execute({
          id: progressId,
          patientId,
          clinicId: userId,
        })

        expect(dto.id).toBe(progressId)
        expect(dto.service).toBe('Avaliação')
      })
    })

    it('lança 404 quando não encontra evolução', async () => {
      await withRollbackTransaction(knex, async (trx) => {
        const { userId } = await insertIntegrationUser(trx)
        const { patientId } = await insertPatientForIntegration(trx, userId, {
          name: 'Get Progress 404',
          phone: '(51) 93333 0002',
        })

        const useCase = new GetProgressUseCase(new KnexProgressRepository(trx))
        await expect(
          useCase.execute({
            id: uuidv4(),
            patientId,
            clinicId: userId,
          }),
        ).rejects.toMatchObject({ statusCode: 404 })
      })
    })
  },
)

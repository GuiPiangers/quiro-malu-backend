import { db } from '../../database/knex'
import { KnexPasswordResetTokenRepository } from './KnexPasswordResetTokenRepository'

export const knexPasswordResetTokenRepository =
  new KnexPasswordResetTokenRepository(db)

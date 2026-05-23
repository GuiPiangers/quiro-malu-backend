import { db } from '../../database/knex'
import { KnexClinicianRepository } from './KnexClinicianRepository'

export const knexClinicianRepository = new KnexClinicianRepository(db)

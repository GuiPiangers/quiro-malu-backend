import { CreateDefaultRolesUseCase } from './createDefaultRoles'
import { KnexRbacRepository } from '../../../../repositories/rbac/KnexRbacRepository'
import { db } from '../../../../database/knex/'

const rbacRepository = new KnexRbacRepository(db)
export const createDefaultRolesUseCase = new CreateDefaultRolesUseCase(
  rbacRepository,
)

import { ReplaceRolePermissionsController } from './ReplaceRolePermissionsController'
import { ReplaceRolePermissionsUseCase } from '../../useCases/replaceRolePermissions/ReplaceRolePermissionsUseCase'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'

const replaceRolePermissionsUseCase = new ReplaceRolePermissionsUseCase(
  knexRbacRepository,
)
const replaceRolePermissionsController = new ReplaceRolePermissionsController(
  replaceRolePermissionsUseCase,
)

export { replaceRolePermissionsController }

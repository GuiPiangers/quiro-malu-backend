import { ListRolePermissionsController } from './ListRolePermissionsController'
import { ListRolePermissionsUseCase } from '../../useCases/listRolePermissions/ListRolePermissionsUseCase'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'

const listRolePermissionsUseCase = new ListRolePermissionsUseCase(
  knexRbacRepository,
)
const listRolePermissionsController = new ListRolePermissionsController(
  listRolePermissionsUseCase,
)

export { listRolePermissionsController }

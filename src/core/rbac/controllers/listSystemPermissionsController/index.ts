import { ListSystemPermissionsController } from './ListSystemPermissionsController'
import { ListSystemPermissionsUseCase } from '../../useCases/listSystemPermissions/ListSystemPermissionsUseCase'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'

const listSystemPermissionsUseCase = new ListSystemPermissionsUseCase(
  knexRbacRepository,
)
const listSystemPermissionsController = new ListSystemPermissionsController(
  listSystemPermissionsUseCase,
)

export { listSystemPermissionsController }

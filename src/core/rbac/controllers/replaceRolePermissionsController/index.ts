import { ReplaceRolePermissionsController } from './ReplaceRolePermissionsController'
import { ReplaceRolePermissionsUseCase } from '../../useCases/replaceRolePermissions/ReplaceRolePermissionsUseCase'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'
import { knexClinicianRepository } from '../../../../repositories/clinician/knexInstances'

const replaceRolePermissionsUseCase = new ReplaceRolePermissionsUseCase(
  knexRbacRepository,
  knexClinicianRepository,
)
const replaceRolePermissionsController = new ReplaceRolePermissionsController(
  replaceRolePermissionsUseCase,
)

export { replaceRolePermissionsController }

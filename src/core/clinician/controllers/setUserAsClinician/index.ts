import { knexClinicianRepository } from '../../../../repositories/clinician/knexInstances'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'
import { SetUserAsClinicianUseCase } from '../../useCases/setUserAsClinician/SetUserAsClinicianUseCase'
import { SetUserAsClinicianController } from './SetUserAsClinicianController'

const setUserAsClinicianUseCase = new SetUserAsClinicianUseCase(
  knexClinicianRepository,
  knexUserRepository,
  knexRbacRepository,
)
const setUserAsClinicianController = new SetUserAsClinicianController(
  setUserAsClinicianUseCase,
)

export { setUserAsClinicianController }

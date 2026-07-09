import { GetUserProfileController } from './GetUserProfileController'
import { GetUserUseCase } from '../../useCases/getUser/GetUserUseCase'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'
import { knexClinicianRepository } from '../../../../repositories/clinician/knexInstances'

const getUserUseCase = new GetUserUseCase(
  knexUserRepository,
  knexClinicianRepository,
)
const getUserProfileController = new GetUserProfileController(getUserUseCase)

export { getUserProfileController }

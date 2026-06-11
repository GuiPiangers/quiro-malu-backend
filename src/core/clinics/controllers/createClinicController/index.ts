import { knexClinicRepository } from '../../../../repositories/clinic/knexInstances'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'
import { knexClinicianRepository } from '../../../../repositories/clinician/knexInstances'
import { CreateClinicUseCase } from '../../useCases/createClinic/CreateClinicUseCase'
import { CreateClinicController } from './CreateClinicController'

const createClinicUseCase = new CreateClinicUseCase(
  knexClinicRepository,
  knexRbacRepository,
  knexUserRepository,
  knexClinicianRepository,
)
const createClinicController = new CreateClinicController(createClinicUseCase)

export { createClinicController }

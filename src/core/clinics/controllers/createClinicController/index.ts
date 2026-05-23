import { knexClinicRepository } from '../../../../repositories/clinic/knexInstances'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'
import { CreateClinicUseCase } from '../../useCases/createClinic/CreateClinicUseCase'
import { CreateClinicController } from './CreateClinicController'

const createClinicUseCase = new CreateClinicUseCase(
  knexClinicRepository,
  knexRbacRepository,
)
const createClinicController = new CreateClinicController(createClinicUseCase)

export { createClinicController }

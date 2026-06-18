import { knexClinicRepository } from '../../../../repositories/clinic/knexInstances'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'
import { appEventListener } from '../../../shared/observers/EventListener'
import { CreateClinicUseCase } from '../../useCases/createClinic/CreateClinicUseCase'
import { CreateClinicController } from './CreateClinicController'

const createClinicUseCase = new CreateClinicUseCase(
  knexClinicRepository,
  knexRbacRepository,
  knexUserRepository,
  appEventListener,
)
const createClinicController = new CreateClinicController(createClinicUseCase)

export { createClinicController }

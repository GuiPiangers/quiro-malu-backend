import { CreateUserUseCase } from '../../useCases/createUser/CreateUserUseCase'
import { CreateUserController } from './CreateUserController'
import { knexUserRepository } from '../../../../repositories/user/knexInstances'
import { knexClinicRepository } from '../../../../repositories/clinic/knexInstances'
import { knexRbacRepository } from '../../../../repositories/rbac/knexInstances'
import { appEventListener } from '../../../../core/shared/observers/EventListener'

const mySqlUserRepository = knexUserRepository
const createUserUseCase = new CreateUserUseCase(
  mySqlUserRepository,
  knexClinicRepository,
  knexRbacRepository,
  appEventListener,
)
const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }

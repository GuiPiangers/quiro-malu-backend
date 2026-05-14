import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";
import { knexClinicRepository } from "../../../../repositories/clinic/knexInstances";

const mySqlUserRepository = knexUserRepository
const createUserUseCase = new CreateUserUseCase(
  mySqlUserRepository,
  knexClinicRepository,
)
const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }

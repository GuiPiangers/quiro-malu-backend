import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";

const mySqlUserRepository = knexUserRepository
const createUserUseCase = new CreateUserUseCase(mySqlUserRepository)
const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }
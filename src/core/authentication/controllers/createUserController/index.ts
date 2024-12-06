import { KnexUserRepository } from "../../../../repositories/user/KnexUserRepository";
import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";

const mySqlUserRepository = new KnexUserRepository()
const createUserUseCase = new CreateUserUseCase(mySqlUserRepository)
const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }
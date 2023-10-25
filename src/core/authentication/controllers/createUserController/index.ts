import { MySqlUserRepository } from "../../../../repositories/user/MySqlUserRepository";
import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";
import { CreateUserController } from "./CreateUserController";

const mySqlUserRepository = new MySqlUserRepository()
const createUserUseCase = new CreateUserUseCase(mySqlUserRepository)
const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }
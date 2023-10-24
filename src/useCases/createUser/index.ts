import { MySqlUserRepository } from "../../repositories/user/MySqlUserRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

const mySqlRepository = new MySqlUserRepository

const createUserUseCase = new CreateUserUseCase(mySqlRepository)
const createUserController = new CreateUserController(createUserUseCase)

export { createUserController }
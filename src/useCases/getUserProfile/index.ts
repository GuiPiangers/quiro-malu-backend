import { MySqlUserRepository } from "../../repositories/user/MySqlUserRepository";
import { GetUserProfileUseCase } from "./GetUserProfileUseCase";
import { GetUserProfileController } from "./GetUserProfileController";

const mySqlUserRepository = new MySqlUserRepository()
const getProfileUseCase = new GetUserProfileUseCase(mySqlUserRepository)
const getProfileController = new GetUserProfileController(getProfileUseCase)

export { getProfileUseCase, getProfileController }


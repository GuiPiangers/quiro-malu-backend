import { MySqlUserRepository } from "../../../../repositories/user/MySqlUserRepository";
import { GetUserProfileUseCase } from "../../useCases/getUser/GetUserProfileUseCase";
import { GetUserProfileController } from "./GetUserProfileController";

const mySqlUserRepository = new MySqlUserRepository()
const getProfileUseCase = new GetUserProfileUseCase(mySqlUserRepository)
const getUserProfileController = new GetUserProfileController(getProfileUseCase)

export { getUserProfileController }


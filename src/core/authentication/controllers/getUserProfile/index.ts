import { KnexUserRepository } from "../../../../repositories/user/KnexUserRepository";
import { GetUserProfileUseCase } from "../../useCases/getUser/GetUserProfileUseCase";
import { GetUserProfileController } from "./GetUserProfileController";

const mySqlUserRepository = new KnexUserRepository()
const getProfileUseCase = new GetUserProfileUseCase(mySqlUserRepository)
const getUserProfileController = new GetUserProfileController(getProfileUseCase)

export { getUserProfileController }


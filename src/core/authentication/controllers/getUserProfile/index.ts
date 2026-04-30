import { GetUserProfileUseCase } from "../../useCases/getUser/GetUserProfileUseCase";
import { GetUserProfileController } from "./GetUserProfileController";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";

const mySqlUserRepository = knexUserRepository
const getProfileUseCase = new GetUserProfileUseCase(mySqlUserRepository)
const getUserProfileController = new GetUserProfileController(getProfileUseCase)

export { getUserProfileController }

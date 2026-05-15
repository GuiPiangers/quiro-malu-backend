import { GetUserProfileController } from "./GetUserProfileController";
import { GetUserProfileUseCase } from "../../useCases/getUser/GetUserProfileUseCase";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";

const getProfileUseCase = new GetUserProfileUseCase(knexUserRepository);
const getUserProfileController = new GetUserProfileController(getProfileUseCase);

export { getUserProfileController };

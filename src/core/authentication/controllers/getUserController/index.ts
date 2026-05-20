import { knexClinicianRepository } from "../../../../repositories/clinician/knexInstances";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";
import { GetUserController } from "./GetUserController";
import { GetUserUseCase } from "../../useCases/getUser/GetUserUseCase";

const getUserUseCase = new GetUserUseCase(
  knexUserRepository,
  knexClinicianRepository,
);
const getUserController = new GetUserController(getUserUseCase);

export { getUserController };

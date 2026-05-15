import { knexUserRepository } from "../../../../repositories/user/knexInstances";
import { DeleteClinicUserController } from "./DeleteClinicUserController";
import { DeleteClinicUserUseCase } from "../../useCases/deleteClinicUser/DeleteClinicUserUseCase";

const deleteClinicUserUseCase = new DeleteClinicUserUseCase(knexUserRepository);
const deleteClinicUserController = new DeleteClinicUserController(
  deleteClinicUserUseCase,
);

export { deleteClinicUserController };

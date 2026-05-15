import { knexRbacRepository } from "../../../../repositories/rbac/knexInstances";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";
import { DeleteClinicUserController } from "./DeleteClinicUserController";
import { DeleteClinicUserUseCase } from "../../useCases/deleteClinicUser/DeleteClinicUserUseCase";

const deleteClinicUserUseCase = new DeleteClinicUserUseCase(
  knexUserRepository,
  knexRbacRepository,
);
const deleteClinicUserController = new DeleteClinicUserController(
  deleteClinicUserUseCase,
);

export { deleteClinicUserController };

import { knexUserRepository } from "../../../../repositories/user/knexInstances";
import { ListClinicUsersController } from "./ListClinicUsersController";
import { ListClinicUsersUseCase } from "../../useCases/listClinicUsers/ListClinicUsersUseCase";

const listClinicUsersUseCase = new ListClinicUsersUseCase(knexUserRepository);
const listClinicUsersController = new ListClinicUsersController(
  listClinicUsersUseCase,
);

export { listClinicUsersController };

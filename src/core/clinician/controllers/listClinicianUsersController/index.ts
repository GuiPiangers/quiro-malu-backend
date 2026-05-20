import { knexClinicianRepository } from "../../../../repositories/clinician/knexInstances";
import { ListClinicianUsersController } from "./ListClinicianUsersController";
import { ListClinicianUsersUseCase } from "../../useCases/listClinicianUsers/ListClinicianUsersUseCase";

const listClinicianUsersUseCase = new ListClinicianUsersUseCase(
  knexClinicianRepository,
);
const listClinicianUsersController = new ListClinicianUsersController(
  listClinicianUsersUseCase,
);

export { listClinicianUsersController };

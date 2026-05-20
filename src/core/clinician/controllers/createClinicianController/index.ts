import { knexClinicRepository } from "../../../../repositories/clinic/knexInstances";
import { knexClinicianRepository } from "../../../../repositories/clinician/knexInstances";
import { knexRbacRepository } from "../../../../repositories/rbac/knexInstances";
import { knexServiceRepository } from "../../../../repositories/service/knexInstances";
import { knexUserRepository } from "../../../../repositories/user/knexInstances";
import { CreateClinicianController } from "./CreateClinicianController";
import { CreateClinicianUseCase } from "../../useCases/createClinician/CreateClinicianUseCase";

const createClinicianUseCase = new CreateClinicianUseCase(
  knexClinicianRepository,
  knexUserRepository,
  knexClinicRepository,
  knexRbacRepository,
  knexServiceRepository,
);

const createClinicianController = new CreateClinicianController(
  createClinicianUseCase,
);

export { createClinicianController };

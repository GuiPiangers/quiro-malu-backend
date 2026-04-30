import { CreatePatientUseCase } from "../../useCases/createPatient/CreatePatientUseCase";
import { CreatePatientController } from "./CreatePatientController";
import { knexLocationRepository } from "../../../../repositories/location/knexInstances";
import { knexPatientRepository } from "../../../../repositories/patient/knexInstances";

const locationRepository = knexLocationRepository;
const patientRepository = knexPatientRepository;
const createPatientUseCase = new CreatePatientUseCase(
  patientRepository,
  locationRepository,
);
const createPatientController = new CreatePatientController(
  createPatientUseCase,
);

export { createPatientController };
import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { CreatePatientUseCase } from "../../useCases/createPatient/CreatePatientUseCase";
import { CreatePatientController } from "./CreatePatientController";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";

const locationRepository = new KnexLocationRepository();
const patientRepository = new KnexPatientRepository();
const createPatientUseCase = new CreatePatientUseCase(
  patientRepository,
  locationRepository,
);
const createPatientController = new CreatePatientController(
  createPatientUseCase,
);

export { createPatientController };

import { MySqlLocationRepository } from "../../../../repositories/location/MySqlLocationRepository";
import { CreatePatientUseCase } from "../../useCases/createPatient/CreatePatientUseCase";
import { CreatePatientController } from "./CreatePatientController";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";

const locationRepository = new MySqlLocationRepository();
const patientRepository = new KnexPatientRepository();
const createPatientUseCase = new CreatePatientUseCase(
  patientRepository,
  locationRepository,
);
const createPatientController = new CreatePatientController(
  createPatientUseCase,
);

export { createPatientController };

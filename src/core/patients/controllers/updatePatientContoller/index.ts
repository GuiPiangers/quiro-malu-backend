import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { UpdatePatientUseCase } from "../../useCases/updatePatient/UpdatePatientUseCase";
import { UpdatePatientController } from "./UpdatePatientController";
import { MySqlLocationRepository } from "../../../../repositories/location/MySqlLocationRepository";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";

const locationRepository = new MySqlLocationRepository();
const patientRepository = new KnexPatientRepository();
const updatePatientUseCase = new UpdatePatientUseCase(
  patientRepository,
  locationRepository,
);
const updatePatientController = new UpdatePatientController(
  updatePatientUseCase,
);

export { updatePatientController };

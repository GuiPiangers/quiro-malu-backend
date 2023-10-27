import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { UpdatePatientUseCase } from "../../useCases/updatePatient/UpdatePatientUseCase";
import { UpdatePatientController } from "./UpdatePatientController";
import { MySqlLocationRepository } from "../../../../repositories/location/MySqlLocationRepository";

const locationRepository = new MySqlLocationRepository()
const patientRepository = new MySqlPatientRepository()
const updatePatientUseCase = new UpdatePatientUseCase(patientRepository, locationRepository)
const updatePatientController = new UpdatePatientController(updatePatientUseCase)

export { updatePatientController }
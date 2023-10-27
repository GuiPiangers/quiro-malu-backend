import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { MySqlLocationRepository } from "../../../../repositories/location/MySqlLocationRepository";
import { CreatePatientUseCase } from "../../useCases/createPatient/CreatePatientUseCase";
import { CreatePatientController } from "./CreatePatientController";

const locationRepository = new MySqlLocationRepository()
const patientRepository = new MySqlPatientRepository()
const createPatientUseCase = new CreatePatientUseCase(patientRepository, locationRepository)
const createPatientController = new CreatePatientController(createPatientUseCase)

export { createPatientController }
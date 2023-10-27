import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { GetPatientUseCase } from "../../useCases/getPatient/GetPatientUseCase";
import { GetPatientController } from "./GetPatientController";
import { MySqlLocationRepository } from "../../../../repositories/location/MySqlLocationRepository";

const locationRepository = new MySqlLocationRepository()
const patientRepository = new MySqlPatientRepository()
const getPatientUseCase = new GetPatientUseCase(patientRepository, locationRepository)
const getPatientController = new GetPatientController(getPatientUseCase)

export { getPatientController }
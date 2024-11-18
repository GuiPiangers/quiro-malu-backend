import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { GetPatientUseCase } from "../../useCases/getPatient/GetPatientUseCase";
import { GetPatientController } from "./GetPatientController";
import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";

const locationRepository = new KnexLocationRepository()
const patientRepository = new MySqlPatientRepository()
const getPatientUseCase = new GetPatientUseCase(patientRepository, locationRepository)
const getPatientController = new GetPatientController(getPatientUseCase)

export { getPatientController }
import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { GetPatientUseCase } from "../../useCases/getPatient/GetPatientUseCase";
import { GetPatientController } from "./GetPatientController";
import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";

const locationRepository = new KnexLocationRepository();
const patientRepository = new KnexPatientRepository();
const getPatientUseCase = new GetPatientUseCase(
  patientRepository,
  locationRepository,
);
const getPatientController = new GetPatientController(getPatientUseCase);

export { getPatientController };

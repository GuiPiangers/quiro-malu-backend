import { GetPatientUseCase } from "../../useCases/getPatient/GetPatientUseCase";
import { GetPatientController } from "./GetPatientController";
import { knexLocationRepository } from "../../../../repositories/location/knexInstances";
import { knexPatientRepository } from "../../../../repositories/patient/knexInstances";

const locationRepository = knexLocationRepository;
const patientRepository = knexPatientRepository;
const getPatientUseCase = new GetPatientUseCase(
  patientRepository,
  locationRepository,
);
const getPatientController = new GetPatientController(getPatientUseCase);

export { getPatientController, getPatientUseCase };
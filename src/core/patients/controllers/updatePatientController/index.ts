import { UpdatePatientUseCase } from "../../useCases/updatePatient/UpdatePatientUseCase";
import { UpdatePatientController } from "./UpdatePatientController";
import { knexLocationRepository } from "../../../../repositories/location/knexInstances";
import { knexPatientRepository } from "../../../../repositories/patient/knexInstances";

const locationRepository = knexLocationRepository;
const patientRepository = knexPatientRepository;
const updatePatientUseCase = new UpdatePatientUseCase(
  patientRepository,
  locationRepository,
);
const updatePatientController = new UpdatePatientController(
  updatePatientUseCase,
);

export { updatePatientController };
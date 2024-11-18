import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { UpdatePatientUseCase } from "../../useCases/updatePatient/UpdatePatientUseCase";
import { UpdatePatientController } from "./UpdatePatientController";
import { KnexLocationRepository } from "../../../../repositories/location/KnexLocationRepository";
import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";

const locationRepository = new KnexLocationRepository();
const patientRepository = new KnexPatientRepository();
const updatePatientUseCase = new UpdatePatientUseCase(
  patientRepository,
  locationRepository,
);
const updatePatientController = new UpdatePatientController(
  updatePatientUseCase,
);

export { updatePatientController };

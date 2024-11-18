import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { DeletePatientUseCase } from "../../useCases/deletePatient/DeletePatientUseCase";
import { DeletePatientsController } from "./DeletePatientsController";

const patientRepository = new KnexPatientRepository();
const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
const deletePatientController = new DeletePatientsController(
  deletePatientUseCase,
);

export { deletePatientController };

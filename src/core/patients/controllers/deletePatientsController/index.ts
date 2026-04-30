import { DeletePatientUseCase } from "../../useCases/deletePatient/DeletePatientUseCase";
import { DeletePatientsController } from "./DeletePatientsController";
import { knexPatientRepository } from "../../../../repositories/patient/knexInstances";

const patientRepository = knexPatientRepository;
const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
const deletePatientController = new DeletePatientsController(
  deletePatientUseCase,
);

export { deletePatientController };
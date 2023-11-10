import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { DeletePatientUseCase } from "../../useCases/deletePatient/DeletePatientUseCase";
import { DeletePatientsController } from "./DeletePatientsController";

const patientRepository = new MySqlPatientRepository()
const deletePatientUseCase = new DeletePatientUseCase(patientRepository)
const deletePatientController = new DeletePatientsController(deletePatientUseCase)

export { deletePatientController }
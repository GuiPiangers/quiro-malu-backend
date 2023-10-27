import { MySqlPatientRepository } from "../../../../repositories/patient/MySqlPatientRepository";
import { ListPatientsUseCase } from "../../useCases/listPatients/ListPatientsUseCase";
import { ListPatientsController } from "./ListPatientsController";

const patientRepository = new MySqlPatientRepository()
const listPatientsUseCase = new ListPatientsUseCase(patientRepository)
const listPatientsController = new ListPatientsController(listPatientsUseCase)

export { listPatientsController }
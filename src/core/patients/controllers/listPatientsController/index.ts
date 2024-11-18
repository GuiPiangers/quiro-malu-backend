import { KnexPatientRepository } from "../../../../repositories/patient/KnexPatientRepository";
import { ListPatientsUseCase } from "../../useCases/listPatients/ListPatientsUseCase";
import { ListPatientsController } from "./ListPatientsController";

const patientRepository = new KnexPatientRepository();
const listPatientsUseCase = new ListPatientsUseCase(patientRepository);
const listPatientsController = new ListPatientsController(listPatientsUseCase);

export { listPatientsController };

import { ListPatientsUseCase } from "../../useCases/listPatients/ListPatientsUseCase";
import { ListPatientsController } from "./ListPatientsController";
import { knexPatientRepository } from "../../../../repositories/patient/knexInstances";

const patientRepository = knexPatientRepository;
const listPatientsUseCase = new ListPatientsUseCase(patientRepository);
const listPatientsController = new ListPatientsController(listPatientsUseCase);

export { listPatientsController };
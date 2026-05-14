import { knexClinicRepository } from "../../../../repositories/clinic/knexInstances";
import { CreateClinicUseCase } from "../../useCases/createClinic/CreateClinicUseCase";
import { CreateClinicController } from "./CreateClinicController";

const createClinicUseCase = new CreateClinicUseCase(knexClinicRepository);
const createClinicController = new CreateClinicController(createClinicUseCase);

export { createClinicController };

import { KnexServiceRepository } from "../../../../repositories/service/KnexServiceRepository";
import { CreateServiceUseCase } from "../../useCases/createService/CreateServiceUseCase";
import { CreateServiceController } from "./CreateServiceController";

const serviceRepository = new KnexServiceRepository()
const createServiceUseCase = new CreateServiceUseCase(serviceRepository)
const createServiceController = new CreateServiceController(createServiceUseCase)

export { createServiceController }
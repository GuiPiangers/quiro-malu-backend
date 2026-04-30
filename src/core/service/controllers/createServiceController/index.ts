import { CreateServiceUseCase } from "../../useCases/createService/CreateServiceUseCase";
import { CreateServiceController } from "./CreateServiceController";
import { knexServiceRepository } from "../../../../repositories/service/knexInstances";

const serviceRepository = knexServiceRepository
const createServiceUseCase = new CreateServiceUseCase(serviceRepository)
const createServiceController = new CreateServiceController(createServiceUseCase)

export { createServiceController }
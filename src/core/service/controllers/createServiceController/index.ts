import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { CreateServiceUseCase } from "../../useCases/createService/CreateServiceUseCase";
import { CreateServiceController } from "./CreateServiceController";

const ServiceRepository = new MySqlServiceRepository()
const createServiceUseCase = new CreateServiceUseCase(ServiceRepository)
const createServiceController = new CreateServiceController(createServiceUseCase)

export { createServiceController }
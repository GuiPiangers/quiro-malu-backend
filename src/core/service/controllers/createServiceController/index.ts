import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { CreateServiceUseCase } from "../../useCases/createService/CreateServiceUseCase";
import { CreateServiceController } from "./CreateServiceController";

const serviceRepository = new MySqlServiceRepository()
const createServiceUseCase = new CreateServiceUseCase(serviceRepository)
const createServiceController = new CreateServiceController(createServiceUseCase)

export { createServiceController }
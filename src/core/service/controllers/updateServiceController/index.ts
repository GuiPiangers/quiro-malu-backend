import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { UpdateServiceUseCase } from "../../useCases/updateService/UpdateServiceUseCase";
import { UpdateServiceController } from "./UpdateServiceController";

const ServiceRepository = new MySqlServiceRepository()
const updateServiceUseCase = new UpdateServiceUseCase(ServiceRepository)
const updateServiceController = new UpdateServiceController(updateServiceUseCase)

export { updateServiceController }
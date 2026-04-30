import { UpdateServiceUseCase } from "../../useCases/updateService/UpdateServiceUseCase";
import { UpdateServiceController } from "./UpdateServiceController";
import { knexServiceRepository } from "../../../../repositories/service/knexInstances";

const ServiceRepository = knexServiceRepository
const updateServiceUseCase = new UpdateServiceUseCase(ServiceRepository)
const updateServiceController = new UpdateServiceController(updateServiceUseCase)

export { updateServiceController }
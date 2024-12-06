import { KnexServiceRepository } from "../../../../repositories/service/KnexServiceRepository";
import { UpdateServiceUseCase } from "../../useCases/updateService/UpdateServiceUseCase";
import { UpdateServiceController } from "./UpdateServiceController";

const ServiceRepository = new KnexServiceRepository()
const updateServiceUseCase = new UpdateServiceUseCase(ServiceRepository)
const updateServiceController = new UpdateServiceController(updateServiceUseCase)

export { updateServiceController }
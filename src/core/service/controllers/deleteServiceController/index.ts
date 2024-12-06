import { KnexServiceRepository } from "../../../../repositories/service/KnexServiceRepository";
import { DeleteServiceUseCase } from "../../useCases/deleteService/DeleteServiceUseCase";
import { DeleteServiceController } from "./DeleteServiceController";

const serviceRepository = new KnexServiceRepository()
const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository)
const deleteServiceController = new DeleteServiceController(deleteServiceUseCase)

export { deleteServiceController }
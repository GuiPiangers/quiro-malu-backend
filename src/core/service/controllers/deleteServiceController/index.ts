import { DeleteServiceUseCase } from "../../useCases/deleteService/DeleteServiceUseCase";
import { DeleteServiceController } from "./DeleteServiceController";
import { knexServiceRepository } from "../../../../repositories/service/knexInstances";

const serviceRepository = knexServiceRepository
const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository)
const deleteServiceController = new DeleteServiceController(deleteServiceUseCase)

export { deleteServiceController }
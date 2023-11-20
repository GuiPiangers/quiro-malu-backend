import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { DeleteServiceUseCase } from "../../useCases/deleteService/DeleteServiceUseCase";
import { DeleteServiceController } from "./DeleteServiceController";

const ServiceRepository = new MySqlServiceRepository()
const deleteServiceUseCase = new DeleteServiceUseCase(ServiceRepository)
const deleteServiceController = new DeleteServiceController(deleteServiceUseCase)

export { deleteServiceController }
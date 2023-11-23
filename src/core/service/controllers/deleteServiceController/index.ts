import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { DeleteServiceUseCase } from "../../useCases/deleteService/DeleteServiceUseCase";
import { DeleteServiceController } from "./DeleteServiceController";

const serviceRepository = new MySqlServiceRepository()
const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository)
const deleteServiceController = new DeleteServiceController(deleteServiceUseCase)

export { deleteServiceController }
import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { ListServiceUseCase } from "../../useCases/listService/ListServiceUseCase";
import { ListServiceController } from "./ListServiceController";

const serviceRepository = new MySqlServiceRepository()
const listServiceUseCase = new ListServiceUseCase(serviceRepository)
const listServiceController = new ListServiceController(listServiceUseCase)

export { listServiceController }
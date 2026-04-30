import { ListServiceUseCase } from "../../useCases/listService/ListServiceUseCase";
import { ListServiceController } from "./ListServiceController";
import { knexServiceRepository } from "../../../../repositories/service/knexInstances";

const serviceRepository = knexServiceRepository
const listServiceUseCase = new ListServiceUseCase(serviceRepository)
const listServiceController = new ListServiceController(listServiceUseCase)

export { listServiceController }
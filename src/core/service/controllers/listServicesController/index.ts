import { KnexServiceRepository } from "../../../../repositories/service/KnexServiceRepository";
import { ListServiceUseCase } from "../../useCases/listService/ListServiceUseCase";
import { ListServiceController } from "./ListServiceController";

const serviceRepository = new KnexServiceRepository()
const listServiceUseCase = new ListServiceUseCase(serviceRepository)
const listServiceController = new ListServiceController(listServiceUseCase)

export { listServiceController }
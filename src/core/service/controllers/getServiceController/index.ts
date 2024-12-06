import { KnexServiceRepository } from "../../../../repositories/service/KnexServiceRepository";
import { GetServiceUseCase } from "../../useCases/getService/GetServiceUseCase";
import { GetServiceController } from "./GetServiceController";

const serviceRepository = new KnexServiceRepository()
const getServiceUseCase = new GetServiceUseCase(serviceRepository)
const getServiceController = new GetServiceController(getServiceUseCase)

export { getServiceController }
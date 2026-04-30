import { GetServiceUseCase } from "../../useCases/getService/GetServiceUseCase";
import { GetServiceController } from "./GetServiceController";
import { knexServiceRepository } from "../../../../repositories/service/knexInstances";

const serviceRepository = knexServiceRepository
const getServiceUseCase = new GetServiceUseCase(serviceRepository)
const getServiceController = new GetServiceController(getServiceUseCase)

export { getServiceController }
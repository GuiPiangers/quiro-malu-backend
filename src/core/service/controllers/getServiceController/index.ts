import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { GetServiceUseCase } from "../../useCases/getService/GetServiceUseCase";
import { GetServiceController } from "./GetServiceController";

const ServiceRepository = new MySqlServiceRepository()
const getServiceUseCase = new GetServiceUseCase(ServiceRepository)
const getServiceController = new GetServiceController(getServiceUseCase)

export { getServiceController }
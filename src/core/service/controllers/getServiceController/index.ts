import { MySqlServiceRepository } from "../../../../repositories/service/MySqlServiceRepository";
import { GetServiceUseCase } from "../../useCases/getService/GetServiceUseCase";
import { GetServiceController } from "./GetServiceController";

const serviceRepository = new MySqlServiceRepository()
const getServiceUseCase = new GetServiceUseCase(serviceRepository)
const getServiceController = new GetServiceController(getServiceUseCase)

export { getServiceController }
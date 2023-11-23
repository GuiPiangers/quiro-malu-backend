import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { GetSchedulingUseCase } from "../../useCases/getScheduling/GetSchedulingUseCase";
import { GetSchedulingController } from "./GetSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository()
const getSchedulingUseCase = new GetSchedulingUseCase(schedulingRepository)
const getSchedulingController = new GetSchedulingController(getSchedulingUseCase)

export { getSchedulingController }
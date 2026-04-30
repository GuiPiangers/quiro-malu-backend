import { GetSchedulingUseCase } from "../../useCases/getScheduling/GetSchedulingUseCase";
import { GetSchedulingController } from "./GetSchedulingController";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository
const getSchedulingUseCase = new GetSchedulingUseCase(schedulingRepository)
const getSchedulingController = new GetSchedulingController(getSchedulingUseCase)

export { getSchedulingController }
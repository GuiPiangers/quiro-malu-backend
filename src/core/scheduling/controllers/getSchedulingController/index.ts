import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { GetSchedulingUseCase } from "../../useCases/getScheduling/GetSchedulingUseCase";
import { GetSchedulingController } from "./GetSchedulingController";

const schedulingRepository = new KnexSchedulingRepository()
const getSchedulingUseCase = new GetSchedulingUseCase(schedulingRepository)
const getSchedulingController = new GetSchedulingController(getSchedulingUseCase)

export { getSchedulingController }
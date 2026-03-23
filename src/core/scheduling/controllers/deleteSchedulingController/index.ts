import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { DeleteSchedulingUseCase } from "../../useCases/deleteScheduling/DeleteSchedulingUseCase";
import { DeleteSchedulingController } from "./DeleteSchedulingController";

const schedulingRepository = new KnexSchedulingRepository()
const deleteSchedulingUseCase = new DeleteSchedulingUseCase(schedulingRepository)
const deleteSchedulingController = new DeleteSchedulingController(deleteSchedulingUseCase)

export { deleteSchedulingController }
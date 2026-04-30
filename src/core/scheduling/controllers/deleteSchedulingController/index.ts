import { DeleteSchedulingUseCase } from "../../useCases/deleteScheduling/DeleteSchedulingUseCase";
import { DeleteSchedulingController } from "./DeleteSchedulingController";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository
const deleteSchedulingUseCase = new DeleteSchedulingUseCase(schedulingRepository)
const deleteSchedulingController = new DeleteSchedulingController(deleteSchedulingUseCase)

export { deleteSchedulingController }
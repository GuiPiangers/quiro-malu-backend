import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { DeleteSchedulingUseCase } from "../../useCases/deleteScheduling/DeleteSchedulingUseCase";
import { DeleteSchedulingController } from "./DeleteSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository()
const deleteSchedulingUseCase = new DeleteSchedulingUseCase(schedulingRepository)
const deleteSchedulingController = new DeleteSchedulingController(deleteSchedulingUseCase)

export { deleteSchedulingController }
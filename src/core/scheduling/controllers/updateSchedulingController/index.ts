import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { UpdateSchedulingUseCase } from "../../useCases/updateScheduling/UpdateSchedulingUseCase";
import { UpdateSchedulingController } from "./UpdateSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository()
const updateSchedulingUseCase = new UpdateSchedulingUseCase(schedulingRepository)
const updateSchedulingController = new UpdateSchedulingController(updateSchedulingUseCase)

export { updateSchedulingController }
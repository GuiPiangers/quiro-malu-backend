import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { ListSchedulingUseCase } from "../../useCases/listScheduling/ListSchedulingUseCase";
import { ListSchedulingController } from "./ListSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository()
const listSchedulingUseCase = new ListSchedulingUseCase(schedulingRepository)
const listSchedulingController = new ListSchedulingController(listSchedulingUseCase)

export { listSchedulingController }
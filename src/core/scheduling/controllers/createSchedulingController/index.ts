import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { CreateSchedulingUseCase } from "../../useCases/createScheduling/CreateSchedulingUseCase";
import { CreateSchedulingController } from "./CreateSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository();
const createSchedulingUseCase = new CreateSchedulingUseCase(
  schedulingRepository,
);
const createSchedulingController = new CreateSchedulingController(
  createSchedulingUseCase,
);

export { createSchedulingController };

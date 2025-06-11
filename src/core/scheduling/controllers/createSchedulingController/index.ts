import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { CreateSchedulingUseCase } from "../../useCases/createScheduling/CreateSchedulingUseCase";
import { CreateSchedulingController } from "./CreateSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository();
const blockSchedulingRepository = new BlockScheduleRepository();
const createSchedulingUseCase = new CreateSchedulingUseCase(
  schedulingRepository,
  blockSchedulingRepository,
);
const createSchedulingController = new CreateSchedulingController(
  createSchedulingUseCase,
);

export { createSchedulingController };

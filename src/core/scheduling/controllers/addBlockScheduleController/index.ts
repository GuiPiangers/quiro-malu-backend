import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { AddBlockSchedulingUseCase } from "../../useCases/blockScheduling/AddBlockSchedulingUseCase";
import { AddBlockScheduleController } from "./CreateSchedulingController";

const blockScheduleRepository = new BlockScheduleRepository();
const schedulingRepository = new MySqlSchedulingRepository();
const addBlockSchedulingUseCase = new AddBlockSchedulingUseCase(
  blockScheduleRepository,
  schedulingRepository,
);
const addBlockSchedulingController = new AddBlockScheduleController(
  addBlockSchedulingUseCase,
);

export { addBlockSchedulingController };

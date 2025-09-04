import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { appEventListener } from "../../../shared/observers/EventListener";
import { AddBlockSchedulingUseCase } from "../../useCases/blockScheduling/AddBlockScheduling/AddBlockSchedulingUseCase";
import { AddBlockScheduleController } from "./CreateSchedulingController";

const blockScheduleRepository = new BlockScheduleRepository();
const schedulingRepository = new MySqlSchedulingRepository();
const addBlockSchedulingUseCase = new AddBlockSchedulingUseCase(
  blockScheduleRepository,
  schedulingRepository,
  appEventListener,
);
const addBlockSchedulingController = new AddBlockScheduleController(
  addBlockSchedulingUseCase,
);

export { addBlockSchedulingController };

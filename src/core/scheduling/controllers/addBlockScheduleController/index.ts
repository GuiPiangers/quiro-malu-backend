import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { appEventListener } from "../../../shared/observers/EventListener";
import { AddBlockSchedulingUseCase } from "../../useCases/blockScheduling/AddBlockScheduling/AddBlockSchedulingUseCase";
import { AddBlockScheduleController } from "./CreateSchedulingController";

const blockScheduleRepository = new BlockScheduleRepository();
const schedulingRepository = new KnexSchedulingRepository();
const addBlockSchedulingUseCase = new AddBlockSchedulingUseCase(
  blockScheduleRepository,
  schedulingRepository,
  appEventListener,
);
const addBlockSchedulingController = new AddBlockScheduleController(
  addBlockSchedulingUseCase,
);

export { addBlockSchedulingController };

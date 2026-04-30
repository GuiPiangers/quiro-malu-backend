import { appEventListener } from "../../../shared/observers/EventListener";
import { AddBlockSchedulingUseCase } from "../../useCases/blockScheduling/AddBlockScheduling/AddBlockSchedulingUseCase";
import { AddBlockScheduleController } from "./CreateSchedulingController";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";
const addBlockSchedulingUseCase = new AddBlockSchedulingUseCase(
  blockScheduleRepository,
  knexSchedulingRepository,
  appEventListener,
);
const addBlockSchedulingController = new AddBlockScheduleController(
  addBlockSchedulingUseCase,
);

export { addBlockSchedulingController };
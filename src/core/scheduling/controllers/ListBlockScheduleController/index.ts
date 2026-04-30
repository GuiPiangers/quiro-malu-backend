import { ListBlockSchedulingUseCase } from "../../useCases/blockScheduling/listBlockSchedules/ListBlockSchedulingUseCase";
import { ListBlockScheduleController } from "./ListBlockSchedulingController";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";
const listBlockSchedulingUseCase = new ListBlockSchedulingUseCase(
  blockScheduleRepository,
);
const listBlockSchedulingController = new ListBlockScheduleController(
  listBlockSchedulingUseCase,
);

export { listBlockSchedulingController };
import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { ListBlockSchedulingUseCase } from "../../useCases/blockScheduling/listBlockSchedules/ListBlockSchedulingUseCase";
import { ListBlockScheduleController } from "./ListBlockSchedulingController";

const blockScheduleRepository = new BlockScheduleRepository();
const listBlockSchedulingUseCase = new ListBlockSchedulingUseCase(
  blockScheduleRepository,
);
const listBlockSchedulingController = new ListBlockScheduleController(
  listBlockSchedulingUseCase,
);

export { listBlockSchedulingController };

import { EditBlockScheduleUseCase } from "../../useCases/blockScheduling/editBlockScheduling/editBlockScheduleUseCase";
import { EditBlockScheduleController } from "./editBlockScheduleController";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const editBlockScheduleUseCase = new EditBlockScheduleUseCase(
  blockScheduleRepository,
  knexSchedulingRepository,
);

const editBlockScheduleController = new EditBlockScheduleController(
  editBlockScheduleUseCase,
);

export { editBlockScheduleController };
import { DeleteBlockScheduleUseCase } from "../../useCases/blockScheduling/deleteBlockSchedule/deleteBlockSchedule";
import { DeleteBlockScheduleController } from "./deleteBlockScheduleController";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";

const deleteBlockScheduleUseCase = new DeleteBlockScheduleUseCase(
  blockScheduleRepository,
);

const deleteBlockScheduleController = new DeleteBlockScheduleController(
  deleteBlockScheduleUseCase,
);

export { deleteBlockScheduleController };
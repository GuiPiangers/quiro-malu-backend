import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { DeleteBlockScheduleUseCase } from "../../useCases/blockScheduling/deleteBlockSchedule/deleteBlockSchedule";
import { DeleteBlockScheduleController } from "./deleteBlockScheduleController";

const blockScheduleRepository = new BlockScheduleRepository();

const deleteBlockScheduleUseCase = new DeleteBlockScheduleUseCase(
  blockScheduleRepository,
);

const deleteBlockScheduleController = new DeleteBlockScheduleController(
  deleteBlockScheduleUseCase,
);

export { deleteBlockScheduleController };

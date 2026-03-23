import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { EditBlockScheduleUseCase } from "../../useCases/blockScheduling/editBlockScheduling/editBlockScheduleUseCase";
import { EditBlockScheduleController } from "./editBlockScheduleController";

const blockScheduleRepository = new BlockScheduleRepository();
const schedulingRepository = new KnexSchedulingRepository();

const editBlockScheduleUseCase = new EditBlockScheduleUseCase(
  blockScheduleRepository,
  schedulingRepository,
);

const editBlockScheduleController = new EditBlockScheduleController(
  editBlockScheduleUseCase,
);

export { editBlockScheduleController };

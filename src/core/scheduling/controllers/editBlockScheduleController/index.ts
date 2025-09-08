import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { EditBlockScheduleUseCase } from "../../useCases/blockScheduling/editBlockScheduling/editBlockScheduleUseCase";
import { EditBlockScheduleController } from "./editBlockScheduleController";

const blockScheduleRepository = new BlockScheduleRepository();
const schedulingRepository = new MySqlSchedulingRepository();

const editBlockScheduleUseCase = new EditBlockScheduleUseCase(
  blockScheduleRepository,
  schedulingRepository,
);

const editBlockScheduleController = new EditBlockScheduleController(
  editBlockScheduleUseCase,
);

export { editBlockScheduleController };

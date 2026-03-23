import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { CreateSchedulingUseCase } from "../../useCases/createScheduling/CreateSchedulingUseCase";
import { CreateSchedulingController } from "./CreateSchedulingController";

const schedulingRepository = new KnexSchedulingRepository();
const blockSchedulingRepository = new BlockScheduleRepository();
const createSchedulingUseCase = new CreateSchedulingUseCase(
  schedulingRepository,
  blockSchedulingRepository,
);
const createSchedulingController = new CreateSchedulingController(
  createSchedulingUseCase,
);

export { createSchedulingController };

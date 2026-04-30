import { CreateSchedulingUseCase } from "../../useCases/createScheduling/CreateSchedulingUseCase";
import { CreateSchedulingController } from "./CreateSchedulingController";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository;
const blockSchedulingRepository = blockScheduleRepository;
const createSchedulingUseCase = new CreateSchedulingUseCase(
  schedulingRepository,
  blockSchedulingRepository,
);
const createSchedulingController = new CreateSchedulingController(
  createSchedulingUseCase,
);

export { createSchedulingController };
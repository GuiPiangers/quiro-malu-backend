import { CreateSchedulingUseCase } from "../../useCases/createScheduling/CreateSchedulingUseCase";
import { CreateSchedulingController } from "./CreateSchedulingController";
import { appEventListener } from "../../../shared/observers/EventListener";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";
import { knexClinicianRepository } from "../../../../repositories/clinician/knexInstances";

const schedulingRepository = knexSchedulingRepository;
const blockSchedulingRepository = blockScheduleRepository;
const createSchedulingUseCase = new CreateSchedulingUseCase(
  schedulingRepository,
  blockSchedulingRepository,
  knexClinicianRepository,
  appEventListener,
);
const createSchedulingController = new CreateSchedulingController(
  createSchedulingUseCase,
);

export { createSchedulingController };
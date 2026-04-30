import { ListEventsUseCase } from "../../useCases/listEvents/ListEventsUseCase";
import { ListEventsController } from "./ListEventsController";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository;
const blockedSchedulingRepository = blockScheduleRepository;
const listEventsUseCase = new ListEventsUseCase(
  schedulingRepository,
  blockedSchedulingRepository,
);
const listEventsController = new ListEventsController(listEventsUseCase);

export { listEventsController };
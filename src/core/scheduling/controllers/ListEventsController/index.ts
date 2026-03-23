import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { ListEventsUseCase } from "../../useCases/listEvents/ListEventsUseCase";
import { ListEventsController } from "./ListEventsController";

const schedulingRepository = new KnexSchedulingRepository();
const blockedSchedulingRepository = new BlockScheduleRepository();
const listEventsUseCase = new ListEventsUseCase(
  schedulingRepository,
  blockedSchedulingRepository,
);
const listEventsController = new ListEventsController(listEventsUseCase);

export { listEventsController };

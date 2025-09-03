import { BlockScheduleRepository } from "../../../../repositories/blockScheduleRepository/BlockScheduleRepository";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { ListEventsUseCase } from "../../useCases/listEvents/ListEventsUseCase";
import { ListEventsController } from "./ListEventsController";

const schedulingRepository = new MySqlSchedulingRepository();
const blockedSchedulingRepository = new BlockScheduleRepository();
const listEventsUseCase = new ListEventsUseCase(
  schedulingRepository,
  blockedSchedulingRepository,
);
const listEventsController = new ListEventsController(listEventsUseCase);

export { listEventsController };

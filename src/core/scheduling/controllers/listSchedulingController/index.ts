import { ListSchedulingUseCase } from "../../useCases/listScheduling/ListSchedulingUseCase";
import { ListSchedulingController } from "./ListSchedulingController";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

/** Instância legada para `GET /schedules`; calendário atual → `listEventsController` / `GET /events`. Ver docs/SCHEDULING_EVENTS.md */
const schedulingRepository = knexSchedulingRepository;
const listSchedulingUseCase = new ListSchedulingUseCase(schedulingRepository);
const listSchedulingController = new ListSchedulingController(
  listSchedulingUseCase,
);

export { listSchedulingController };
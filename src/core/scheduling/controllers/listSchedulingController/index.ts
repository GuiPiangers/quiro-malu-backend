import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { ListSchedulingUseCase } from "../../useCases/listScheduling/ListSchedulingUseCase";
import { ListSchedulingController } from "./ListSchedulingController";

const schedulingRepository = new KnexSchedulingRepository();
const listSchedulingUseCase = new ListSchedulingUseCase(schedulingRepository);
const listSchedulingController = new ListSchedulingController(
  listSchedulingUseCase,
);

export { listSchedulingController };

import { ListSchedulingUseCase } from "../../useCases/listScheduling/ListSchedulingUseCase";
import { ListSchedulingController } from "./ListSchedulingController";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository;
const listSchedulingUseCase = new ListSchedulingUseCase(schedulingRepository);
const listSchedulingController = new ListSchedulingController(
  listSchedulingUseCase,
);

export { listSchedulingController };
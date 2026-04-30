import { RealizeSchedulingUseCase } from "../../useCases/realizeScheduling/realizeSchedulingUseCase";
import { UpdateSchedulingController } from "./RealizeSchedulingController";
import { knexProgressRepository } from "../../../../repositories/progress/knexInstances";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository;
const progressRepository = knexProgressRepository;
const realizeSchedulingUseCase = new RealizeSchedulingUseCase(
  schedulingRepository,
  progressRepository,
);
const realizeSchedulingController = new UpdateSchedulingController(
  realizeSchedulingUseCase,
);

export { realizeSchedulingController };
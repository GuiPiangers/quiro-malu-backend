import { MySqlProgressRepository } from "../../../../repositories/progress/MySqlProgressRepository";
import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { RealizeSchedulingUseCase } from "../../useCases/realizeScheduling/realizeSchedulingUseCase";
import { UpdateSchedulingController } from "./RealizeSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository();
const progressRepository = new MySqlProgressRepository();
const realizeSchedulingUseCase = new RealizeSchedulingUseCase(
  schedulingRepository,
  progressRepository,
);
const realizeSchedulingController = new UpdateSchedulingController(
  realizeSchedulingUseCase,
);

export { realizeSchedulingController };

import { MySqlProgressRepository } from "../../../../../repositories/progress/MySqlProgressRepository";
import { GetProgressBySchedulingUseCase } from "../../../useCases/progress/getProgressByScheduling/GetProgressBySchedulingUseCase";
import { GetProgressBySchedulingController } from "./GetProgressBySchedulingController";

const ProgressRepository = new MySqlProgressRepository();
const getProgressUseCase = new GetProgressBySchedulingUseCase(
  ProgressRepository,
);
const getProgressBySchedulingController = new GetProgressBySchedulingController(
  getProgressUseCase,
);

export { getProgressBySchedulingController };

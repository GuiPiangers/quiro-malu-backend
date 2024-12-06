import { KnexProgressRepository } from "../../../../../repositories/progress/KnexProgressRepository";
import { GetProgressBySchedulingUseCase } from "../../../useCases/progress/getProgressByScheduling/GetProgressBySchedulingUseCase";
import { GetProgressBySchedulingController } from "./GetProgressBySchedulingController";

const ProgressRepository = new KnexProgressRepository();
const getProgressUseCase = new GetProgressBySchedulingUseCase(
  ProgressRepository,
);
const getProgressBySchedulingController = new GetProgressBySchedulingController(
  getProgressUseCase,
);

export { getProgressBySchedulingController };

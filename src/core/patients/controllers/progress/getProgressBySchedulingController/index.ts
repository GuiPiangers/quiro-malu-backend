import { GetProgressBySchedulingUseCase } from "../../../useCases/progress/getProgressByScheduling/GetProgressBySchedulingUseCase";
import { GetProgressBySchedulingController } from "./GetProgressBySchedulingController";
import { knexProgressRepository } from "../../../../../repositories/progress/knexInstances";

const ProgressRepository = knexProgressRepository;
const getProgressUseCase = new GetProgressBySchedulingUseCase(
  ProgressRepository,
);
const getProgressBySchedulingController = new GetProgressBySchedulingController(
  getProgressUseCase,
);

export { getProgressBySchedulingController };
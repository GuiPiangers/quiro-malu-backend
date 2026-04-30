import { GetProgressUseCase } from "../../../useCases/progress/getProgress/GetProgressUseCase";
import { GetProgressController } from "./GetProgressController";
import { knexProgressRepository } from "../../../../../repositories/progress/knexInstances";

const ProgressRepository = knexProgressRepository;
const getProgressUseCase = new GetProgressUseCase(ProgressRepository);
const getProgressController = new GetProgressController(getProgressUseCase);

export { getProgressController };
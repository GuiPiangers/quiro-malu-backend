import { KnexProgressRepository } from "../../../../../repositories/progress/KnexProgressRepository";
import { GetProgressUseCase } from "../../../useCases/progress/getProgress/GetProgressUseCase";
import { GetProgressController } from "./GetProgressController";

const ProgressRepository = new KnexProgressRepository();
const getProgressUseCase = new GetProgressUseCase(ProgressRepository);
const getProgressController = new GetProgressController(getProgressUseCase);

export { getProgressController };

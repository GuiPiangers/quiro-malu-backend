import { MySqlProgressRepository } from "../../../../../repositories/progress/MySqlProgressRepository";
import { GetProgressUseCase } from "../../../useCases/progress/getProgress/GetProgressUseCase";
import { GetProgressController } from "./GetProgressController";

const ProgressRepository = new MySqlProgressRepository()
const getProgressUseCase = new GetProgressUseCase(ProgressRepository)
const getProgressController = new GetProgressController(getProgressUseCase)

export { getProgressController }
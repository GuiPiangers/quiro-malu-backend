import { MySqlProgressRepository } from "../../../../../repositories/progress/MySqlProgressRepository";
import { SetProgressUseCase } from "../../../useCases/progress/setProgress/SetProgressUseCase";
import { SetProgressController } from "./SetProgressController";

const ProgressRepository = new MySqlProgressRepository()
const setProgressUseCase = new SetProgressUseCase(ProgressRepository)
const setProgressController = new SetProgressController(setProgressUseCase)

export { setProgressController }
import { MySqlProgressRepository } from "../../../../../repositories/progress/MySqlProgressRepository";
import { ListProgressUseCase } from "../../../useCases/progress/listProgress/ListProgressUseCase";
import { ListProgressController } from "./ListProgressController";

const ProgressRepository = new MySqlProgressRepository()
const listProgressUseCase = new ListProgressUseCase(ProgressRepository)
const listProgressController = new ListProgressController(listProgressUseCase)

export { listProgressController }
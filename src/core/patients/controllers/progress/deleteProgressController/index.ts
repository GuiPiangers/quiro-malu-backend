import { MySqlProgressRepository } from "../../../../../repositories/progress/MySqlProgressRepository";
import { DeleteProgressUseCase } from "../../../useCases/progress/deleteProgress/DeleteProgressUseCase";
import { DeleteProgressController } from "./DeleteProgressController";

const ProgressRepository = new MySqlProgressRepository()
const deleteProgressUseCase = new DeleteProgressUseCase(ProgressRepository)
const deleteProgressController = new DeleteProgressController(deleteProgressUseCase)

export { deleteProgressController }
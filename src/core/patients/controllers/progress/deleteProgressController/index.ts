import { KnexProgressRepository } from "../../../../../repositories/progress/KnexProgressRepository";
import { DeleteProgressUseCase } from "../../../useCases/progress/deleteProgress/DeleteProgressUseCase";
import { DeleteProgressController } from "./DeleteProgressController";

const ProgressRepository = new KnexProgressRepository()
const deleteProgressUseCase = new DeleteProgressUseCase(ProgressRepository)
const deleteProgressController = new DeleteProgressController(deleteProgressUseCase)

export { deleteProgressController }
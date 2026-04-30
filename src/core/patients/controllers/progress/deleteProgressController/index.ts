import { DeleteProgressUseCase } from "../../../useCases/progress/deleteProgress/DeleteProgressUseCase";
import { DeleteProgressController } from "./DeleteProgressController";
import { knexProgressRepository } from "../../../../../repositories/progress/knexInstances";

const ProgressRepository = knexProgressRepository;
const deleteProgressUseCase = new DeleteProgressUseCase(ProgressRepository);
const deleteProgressController = new DeleteProgressController(
  deleteProgressUseCase,
);

export { deleteProgressController };
import { ListProgressUseCase } from "../../../useCases/progress/listProgress/ListProgressUseCase";
import { ListProgressController } from "./ListProgressController";
import { knexProgressRepository } from "../../../../../repositories/progress/knexInstances";

const ProgressRepository = knexProgressRepository;
const listProgressUseCase = new ListProgressUseCase(ProgressRepository);
const listProgressController = new ListProgressController(listProgressUseCase);

export { listProgressController };
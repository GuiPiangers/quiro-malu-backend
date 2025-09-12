import { KnexProgressRepository } from "../../../../../repositories/progress/KnexProgressRepository";
import { ListProgressUseCase } from "../../../useCases/progress/listProgress/ListProgressUseCase";
import { ListProgressController } from "./ListProgressController";

const ProgressRepository = new KnexProgressRepository();
const listProgressUseCase = new ListProgressUseCase(ProgressRepository);
const listProgressController = new ListProgressController(listProgressUseCase);

export { listProgressController };

import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { RestoreExamUseCase } from "../../useCases/RestoreExamUSeCase";
import { RestoreExamController } from "./RestoreExamController";

const examRepository = new KnexExamsRepository();

const restoreExamUseCase = new RestoreExamUseCase(examRepository);
const restoreExamController = new RestoreExamController(restoreExamUseCase);

export { restoreExamController };

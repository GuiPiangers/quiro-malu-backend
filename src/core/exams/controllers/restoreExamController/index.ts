import { RestoreExamUseCase } from "../../useCases/restoreExam/RestoreExamUseCase";
import { RestoreExamController } from "./RestoreExamController";
import { knexExamsRepository } from "../../../../repositories/examsRepository/knexInstances";

const examRepository = knexExamsRepository;

const restoreExamUseCase = new RestoreExamUseCase(examRepository);
const restoreExamController = new RestoreExamController(restoreExamUseCase);

export { restoreExamController };
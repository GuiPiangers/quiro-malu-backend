import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { DeleteExamUseCase } from "../../useCases/deleteExam/DeleteExamUseCase";
import { DeleteExamController } from "./DeleteExamController";

const examRepository = new KnexExamsRepository();

const deleteExamUseCase = new DeleteExamUseCase(examRepository);
const deleteExamController = new DeleteExamController(deleteExamUseCase);

export { deleteExamController };

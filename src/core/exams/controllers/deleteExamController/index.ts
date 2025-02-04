import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { DeleteExamUseCase } from "../../useCases/deleteExam/DeleteExamUSeCase";
import { DeleteExamController } from "./DeleteExamController";

const examRepository = new KnexExamsRepository();

const deleteExamUseCase = new DeleteExamUseCase(examRepository);
const deleteExamController = new DeleteExamController(deleteExamUseCase);

export { deleteExamController };

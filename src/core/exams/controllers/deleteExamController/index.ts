import { DeleteExamUseCase } from "../../useCases/deleteExam/DeleteExamUseCase";
import { DeleteExamController } from "./DeleteExamController";
import { knexExamsRepository } from "../../../../repositories/examsRepository/knexInstances";

const examRepository = knexExamsRepository;

const deleteExamUseCase = new DeleteExamUseCase(examRepository);
const deleteExamController = new DeleteExamController(deleteExamUseCase);

export { deleteExamController };
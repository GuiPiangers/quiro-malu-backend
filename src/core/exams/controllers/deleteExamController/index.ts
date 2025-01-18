import { S3ExamsFileStorage } from "../../../../repositories/examsFileStorage/S3ExamsFileStorage";
import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { DeleteExamUseCase } from "../../useCases/DeleteExamUSeCase";
import { DeleteExamController } from "./DeleteExamController";

const examStorage = new S3ExamsFileStorage();
const examRepository = new KnexExamsRepository();

const deleteExamUseCase = new DeleteExamUseCase(examRepository, examStorage);
const deleteExamController = new DeleteExamController(deleteExamUseCase);

export { deleteExamController };

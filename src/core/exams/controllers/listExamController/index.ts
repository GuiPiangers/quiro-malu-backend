import { S3ExamsFileStorage } from "../../../../repositories/examsFileStorage/S3ExamsFileStorage";
import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { ListExamUseCase } from "../../useCases/ListExamUSeCase";
import { ListExamController } from "./ListExamController";

const examRepository = new KnexExamsRepository();
const examsFileStorage = new S3ExamsFileStorage();

const listExamUseCase = new ListExamUseCase(examRepository, examsFileStorage);
const listExamController = new ListExamController(listExamUseCase);

export { listExamController };

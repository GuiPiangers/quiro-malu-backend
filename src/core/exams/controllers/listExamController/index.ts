import { S3ExamsFileStorage } from "../../../../repositories/examsFileStorage/S3ExamsFileStorage";
import { ListExamUseCase } from "../../useCases/listExams/ListExamUseCase";
import { ListExamController } from "./ListExamController";
import { knexExamsRepository } from "../../../../repositories/examsRepository/knexInstances";

const examRepository = knexExamsRepository;
const examsFileStorage = new S3ExamsFileStorage();

const listExamUseCase = new ListExamUseCase(examRepository, examsFileStorage);
const listExamController = new ListExamController(listExamUseCase);

export { listExamController };
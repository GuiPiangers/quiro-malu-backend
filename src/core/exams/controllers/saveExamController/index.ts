import { S3ExamsFileStorage } from "../../../../repositories/examsFileStorage/S3ExamsFileStorage";
import { SaveExamUseCase } from "../../useCases/saveExam/SaveExamUseCase";
import { SaveExamController } from "./SaveExamController";
import { knexExamsRepository } from "../../../../repositories/examsRepository/knexInstances";

const examStorage = new S3ExamsFileStorage();
const examRepository = knexExamsRepository;

const saveExamUseCase = new SaveExamUseCase(examRepository, examStorage);
const saveExamController = new SaveExamController(saveExamUseCase);

export { saveExamController };
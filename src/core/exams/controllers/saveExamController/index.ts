import { S3ExamsFileStorage } from "../../../../repositories/examsFileStorage/S3ExamsFileStorage";
import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { SaveExamUseCase } from "../../useCases/SaveExamUseCase";
import { SaveExamController } from "./SaveExamController";

const examStorage = new S3ExamsFileStorage();
const examRepository = new KnexExamsRepository();

const saveExamUseCase = new SaveExamUseCase(examRepository, examStorage);
const saveExamController = new SaveExamController(saveExamUseCase);

export { saveExamController };

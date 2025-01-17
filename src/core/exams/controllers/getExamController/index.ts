import { S3ExamsFileStorage } from "../../../../repositories/examsFileStorage/S3ExamsFileStorage";
// import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { GetExamUseCase } from "../../useCases/GetExamUSeCase";
import { GetExamController } from "./GetExamController";

const examStorage = new S3ExamsFileStorage();
// const examRepository = new KnexExamsRepository();

const getExamUseCase = new GetExamUseCase(examStorage);
const getExamController = new GetExamController(getExamUseCase);

export { getExamController };

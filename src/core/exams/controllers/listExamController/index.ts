import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { ListExamUseCase } from "../../useCases/ListExamUSeCase";
import { ListExamController } from "./ListExamController";

const examRepository = new KnexExamsRepository();

const listExamUseCase = new ListExamUseCase(examRepository);
const listExamController = new ListExamController(listExamUseCase);

export { listExamController };

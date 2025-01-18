import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { ListExamUseCase } from "../../useCases/ListExamUSeCase";
import { getExamUseCase } from "../getExamController";
import { ListExamController } from "./ListExamController";

const examRepository = new KnexExamsRepository();

const listExamUseCase = new ListExamUseCase(examRepository, getExamUseCase);
const listExamController = new ListExamController(listExamUseCase);

export { listExamController };

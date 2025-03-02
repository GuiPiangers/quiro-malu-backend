import { KnexExamsRepository } from "../../../../repositories/examsRepository/KnexExamsRepository";
import { GetExamUseCase } from "./getExamUseCase";

const examRepository = new KnexExamsRepository();
const getExamUseCase = new GetExamUseCase(examRepository);

export { getExamUseCase };

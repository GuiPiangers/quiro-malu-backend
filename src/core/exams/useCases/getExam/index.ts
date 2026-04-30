import { GetExamUseCase } from "./getExamUseCase";
import { knexExamsRepository } from "../../../../repositories/examsRepository/knexInstances";

const examRepository = knexExamsRepository;
const getExamUseCase = new GetExamUseCase(examRepository);

export { getExamUseCase };
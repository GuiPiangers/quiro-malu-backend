import { SetProgressUseCase } from "../../../patients/useCases/progress/setProgress/SetProgressUseCase";
import { knexProgressRepository } from "../../../../repositories/progress/knexInstances";

export function setProgressUseCaseFactory() {
  const ProgressRepository = knexProgressRepository;
  const setProgressUseCase = new SetProgressUseCase(ProgressRepository);
  return setProgressUseCase;
}
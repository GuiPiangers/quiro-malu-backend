import { KnexProgressRepository } from "../../../../repositories/progress/KnexProgressRepository";
import { SetProgressUseCase } from "../../../patients/useCases/progress/setProgress/SetProgressUseCase";

export function setProgressUseCaseFactory() {
  const ProgressRepository = new KnexProgressRepository();
  const setProgressUseCase = new SetProgressUseCase(ProgressRepository);
  return setProgressUseCase;
}

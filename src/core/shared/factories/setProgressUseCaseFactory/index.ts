import { MySqlProgressRepository } from "../../../../repositories/progress/MySqlProgressRepository";
import { SetProgressUseCase } from "../../../patients/useCases/progress/setProgress/SetProgressUseCase";

export function setProgressUseCaseFactory() {
  const ProgressRepository = new MySqlProgressRepository();
  const setProgressUseCase = new SetProgressUseCase(ProgressRepository);
  return setProgressUseCase;
}

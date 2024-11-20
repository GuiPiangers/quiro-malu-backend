import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { UpdateSchedulingUseCase } from "../../../scheduling/useCases/updateScheduling/UpdateSchedulingUseCase";

export function updateSchedulingUseCaseFactory() {
  const schedulingRepository = new MySqlSchedulingRepository();
  const updateSchedulingUseCase = new UpdateSchedulingUseCase(
    schedulingRepository,
  );
  return updateSchedulingUseCase;
}

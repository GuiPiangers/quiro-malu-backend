import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { UpdateSchedulingUseCase } from "../../../scheduling/useCases/updateScheduling/UpdateSchedulingUseCase";

export function updateSchedulingUseCaseFactory() {
  const schedulingRepository = new KnexSchedulingRepository();
  const updateSchedulingUseCase = new UpdateSchedulingUseCase(
    schedulingRepository,
  );
  return updateSchedulingUseCase;
}

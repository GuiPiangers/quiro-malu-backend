import { UpdateSchedulingUseCase } from "../../../scheduling/useCases/updateScheduling/UpdateSchedulingUseCase";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

export function updateSchedulingUseCaseFactory() {
  const schedulingRepository = knexSchedulingRepository;
  const updateSchedulingUseCase = new UpdateSchedulingUseCase(
    schedulingRepository,
  );
  return updateSchedulingUseCase;
}
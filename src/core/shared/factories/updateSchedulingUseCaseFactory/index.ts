import { UpdateSchedulingUseCase } from "../../../scheduling/useCases/updateScheduling/UpdateSchedulingUseCase";
import { blockScheduleRepository } from "../../../../repositories/blockScheduleRepository/knexInstances";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

export function updateSchedulingUseCaseFactory() {
  return new UpdateSchedulingUseCase(
    knexSchedulingRepository,
    blockScheduleRepository,
  );
}
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";
import { SchedulingWithPatient } from "../../models/SchedulingWithPatient";

export class GetSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    const [schedulingData] = await this.SchedulingRepository.get({
      id,
      userId,
    });

    if (!schedulingData) throw new ApiError("Agendamento não encontrado", 404);

    return new SchedulingWithPatient(schedulingData).getDTO();
  }
}

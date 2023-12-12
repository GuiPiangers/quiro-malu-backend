import { Scheduling, SchedulingDTO } from "../../models/Scheduling";
import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../utils/ApiError";

export class UpdateSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) { }

  async execute({ userId, ...data }: SchedulingDTO & { userId: string }) {
    const { id: _, ...scheduling } = new Scheduling(data).getDTO()
    console.log(data, scheduling)
    if (!data.id) throw new ApiError('O id deve ser informado', 400, 'Scheduling')

    await this.SchedulingRepository.update({ userId, id: data.id, ...scheduling });

    return scheduling
  }
}

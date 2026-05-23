import { ISchedulingRepository } from '../../../../repositories/scheduling/ISchedulingRepository'
import {
  appEventListener,
  IAppEventListener,
} from '../../../shared/observers/EventListener'

export class DeleteSchedulingUseCase {
  constructor(
    private SchedulingRepository: ISchedulingRepository,
    private readonly events: IAppEventListener = appEventListener,
  ) {}

  async execute({
    id,
    userId,
    clinicId,
  }: {
    id: string
    userId: string
    clinicId: string
  }) {
    await this.SchedulingRepository.delete({ id, clinicId })
    this.events.emit('deleteSchedule', { scheduleId: id, userId, clinicId })
  }
}

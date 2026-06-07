import { IBlockScheduleRepository } from '../../../../../repositories/blockScheduleRepository/IBlockScheduleRepository'
import { ApiError } from '../../../../../utils/ApiError'
import type { PermissionScope } from '../../../../../types/permissions'
import { assertEventsScopeAccess } from '../../../../../utils/eventsPermissionScope'

export class DeleteBlockScheduleUseCase {
  constructor(private blockScheduleRepository: IBlockScheduleRepository) {}

  async execute({
    id,
    requestUserId,
    eventsWriteScope,
  }: {
    id: string
    requestUserId: string
    eventsWriteScope?: PermissionScope | null
  }): Promise<void> {
    const ownerUserId = await this.blockScheduleRepository.findUserIdById(id)
    if (!ownerUserId) {
      throw new ApiError('Agendamento não encontrado', 404)
    }

    assertEventsScopeAccess(ownerUserId, {
      requestUserId,
      eventsScope: eventsWriteScope,
    })

    await this.blockScheduleRepository.delete({ id, userId: ownerUserId })
  }
}

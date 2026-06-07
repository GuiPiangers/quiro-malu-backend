import { createMockBlockScheduleRepository } from '../../../../../repositories/_mocks/BlockScheduleRepositoryMock'
import { DeleteBlockScheduleUseCase } from './deleteBlockSchedule'
import { IBlockScheduleRepository } from '../../../../../repositories/blockScheduleRepository/IBlockScheduleRepository'
import type { Mocked } from 'vitest'

let blockScheduleRepositoryMock: Mocked<IBlockScheduleRepository>
let deleteBlockScheduleUseCase: DeleteBlockScheduleUseCase

describe('DeleteBlockScheduleUseCase', () => {
  beforeEach(() => {
    blockScheduleRepositoryMock = createMockBlockScheduleRepository()
    deleteBlockScheduleUseCase = new DeleteBlockScheduleUseCase(
      blockScheduleRepositoryMock,
    )
  })

  it('should delete a block schedule', async () => {
    const ownerUserId = '1'

    blockScheduleRepositoryMock.findUserIdById.mockResolvedValue(ownerUserId)

    await deleteBlockScheduleUseCase.execute({
      id: '1',
      requestUserId: ownerUserId,
      eventsWriteScope: { type: 'all' },
    })

    expect(blockScheduleRepositoryMock.delete).toHaveBeenCalledWith({
      id: '1',
      userId: ownerUserId,
    })
  })
})

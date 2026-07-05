import { createMockSchedulingRepository } from '../../../../repositories/_mocks/SchedulingRepositoryMock'
import { IAppEventListener } from '../../../shared/observers/EventListener'
import { DeleteSchedulingUseCase } from './DeleteSchedulingUseCase'

describe('DeleteSchedulingUseCase', () => {
  let deleteSchedulingUseCase: DeleteSchedulingUseCase
  const mockSchedulingRepository = createMockSchedulingRepository()
  const eventsStub: IAppEventListener = { emit: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
    deleteSchedulingUseCase = new DeleteSchedulingUseCase(
      mockSchedulingRepository,
      eventsStub,
    )
  })

  describe('execute', () => {
    it('should call the repository delete method with the correct params', async () => {
      const id = 'test-Scheduling-id'
      const userId = 'test-user-id'
      const clinicId = 'test-clinic-id'

      mockSchedulingRepository.get.mockResolvedValueOnce([
        {
          id,
          userId,
          patientId: 'test-patient-id',
          phone: '(55) 51 99999-9999',
          patient: 'Guilherme Piangers',
        },
      ])

      await deleteSchedulingUseCase.execute({
        id,
        userId,
        clinicId,
        requestUserId: userId,
        eventsWriteScope: { type: 'all' },
      })

      expect(mockSchedulingRepository.delete).toHaveBeenCalledTimes(1)
      expect(mockSchedulingRepository.delete).toHaveBeenCalledWith({
        id,
        clinicId,
      })
    })

    it('should propagate an error if the repository delete method throws', async () => {
      const id = 'test-Scheduling-id'
      const userId = 'test-user-id'
      const clinicId = 'test-clinic-id'
      const errorMessage = 'Failed to delete Scheduling'

      mockSchedulingRepository.get.mockResolvedValueOnce([
        {
          id,
          userId,
          patientId: 'test-patient-id',
          phone: '(55) 51 99999-9999',
          patient: 'Guilherme Piangers',
        },
      ])
      mockSchedulingRepository.delete.mockRejectedValueOnce(
        new Error(errorMessage),
      )

      await expect(
        deleteSchedulingUseCase.execute({
          id,
          userId,
          clinicId,
          requestUserId: userId,
          eventsWriteScope: { type: 'all' },
        }),
      ).rejects.toThrow(errorMessage)
    })
  })
})

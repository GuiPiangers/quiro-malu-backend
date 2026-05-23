import { createMockFinanceRepository } from '../../../../repositories/_mocks/FinanceRepositoryMock'
import { FinanceDTO } from '../../models/Finance'
import { GetFinanceBySchedulingUseCase } from './getFinanceByScheduling'

describe('GetFinanceBySchedulingUseCase', () => {
  let getFinanceBySchedulingUseCase: GetFinanceBySchedulingUseCase

  const mockFinanceRepository = createMockFinanceRepository()

  beforeEach(() => {
    vi.clearAllMocks()
    getFinanceBySchedulingUseCase = new GetFinanceBySchedulingUseCase(
      mockFinanceRepository,
    )
  })

  describe('execute', () => {
    it('Should return Finance data', async () => {
      const clinicId = 'test-user-id'
      const schedulingId = 'test-scheduling-id'
      const FinanceData: FinanceDTO = {
        description: 'Quiropraxia',
        value: 100,
        date: '2025/01/10',
        type: 'expense',
        paymentMethod: 'money',
        schedulingId,
      }

      mockFinanceRepository.getByScheduling.mockResolvedValue(FinanceData)

      const result = await getFinanceBySchedulingUseCase.execute({
        schedulingId,
        clinicId,
      })

      expect(result).toEqual(FinanceData)
    })

    it('Should call repository getByScheduling method with correct arguments ', async () => {
      const clinicId = 'test-user-id'
      const schedulingId = 'test-scheduling-id'
      const FinanceData: FinanceDTO = {
        description: 'Quiropraxia',
        value: 100,
        date: '2025/01/10',
        type: 'expense',
        paymentMethod: 'money',
      }

      mockFinanceRepository.getByScheduling.mockResolvedValue(FinanceData)

      await getFinanceBySchedulingUseCase.execute({
        clinicId,
        schedulingId,
      })

      expect(mockFinanceRepository.getByScheduling).toHaveBeenCalledWith({
        clinicId,
        schedulingId,
      })
      expect(mockFinanceRepository.getByScheduling).toHaveBeenCalledTimes(1)
    })
  })

  it('Should throw an Error if repository get method throws', async () => {
    const clinicId = 'test-user-id'
    const schedulingId = 'test-scheduling-id'
    const errorMessage = 'Error getting Finance'

    mockFinanceRepository.getByScheduling.mockRejectedValue(
      new Error(errorMessage),
    )

    await expect(
      getFinanceBySchedulingUseCase.execute({ schedulingId, clinicId }),
    ).rejects.toThrow(errorMessage)
  })
})

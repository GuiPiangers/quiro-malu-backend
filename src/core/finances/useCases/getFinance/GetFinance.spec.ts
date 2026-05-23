import { createMockFinanceRepository } from '../../../../repositories/_mocks/FinanceRepositoryMock'
import { FinanceDTO } from '../../models/Finance'
import { GetFinanceUseCase } from './getFinanceUseCase'

describe('getFinanceUseCase', () => {
  let getFinanceUseCase: GetFinanceUseCase

  const mockFinanceRepository = createMockFinanceRepository()

  beforeEach(() => {
    vi.clearAllMocks()
    getFinanceUseCase = new GetFinanceUseCase(mockFinanceRepository)
  })
  describe('execute', () => {
    it('Should return Finance data', async () => {
      const clinicId = 'test-user-id'
      const FinanceId = 'test-Finance-id'
      const FinanceData: FinanceDTO = {
        description: 'Quiropraxia',
        value: 100,
        date: '2025/01/10',
        type: 'expense',
        paymentMethod: 'money',
      }

      mockFinanceRepository.get.mockResolvedValue(FinanceData)

      const result = await getFinanceUseCase.execute({
        id: FinanceId,
        clinicId,
      })

      expect(result).toEqual(FinanceData)
    })

    it('Should call repository get method with correct arguments ', async () => {
      const clinicId = 'test-user-id'
      const FinanceId = 'test-Finance-id'
      const FinanceData: FinanceDTO = {
        description: 'Quiropraxia',
        value: 100,
        date: '2025/01/10',
        type: 'expense',
        paymentMethod: 'money',
      }

      mockFinanceRepository.get.mockResolvedValue(FinanceData)

      await getFinanceUseCase.execute({
        clinicId,
        id: FinanceId,
      })

      expect(mockFinanceRepository.get).toHaveBeenCalledWith({
        clinicId,
        id: FinanceId,
      })
      expect(mockFinanceRepository.get).toHaveBeenCalledTimes(1)
    })
  })

  it('Should throw an Error if repository get method throws', async () => {
    const clinicId = 'test-user-id'
    const FinanceId = 'test-Finance-id'
    const errorMessage = 'Error getting Finance'

    mockFinanceRepository.get.mockRejectedValue(new Error(errorMessage))

    await expect(
      getFinanceUseCase.execute({ id: FinanceId, clinicId }),
    ).rejects.toThrow(errorMessage)
  })
})

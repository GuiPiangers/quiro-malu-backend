import { createMockDiagnosticRepository } from '../../../../../repositories/_mocks/DiagnosticRepositoryMock'
import { GetDiagnosticUseCase } from './GetDiagnosticUseCase'

describe('GetDiagnosticUseCase', () => {
  let getDiagnosticUseCase: GetDiagnosticUseCase
  const mockDiagnosticRepository = createMockDiagnosticRepository()

  beforeEach(() => {
    vi.clearAllMocks()
    getDiagnosticUseCase = new GetDiagnosticUseCase(mockDiagnosticRepository)
  })

  describe('execute', () => {
    it('should call the repository Get method with the correct patientId and clinicId', async () => {
      const patientId = 'test-patient-id'
      const clinicId = 'test-user-id'

      await getDiagnosticUseCase.execute(patientId, clinicId)

      expect(mockDiagnosticRepository.get).toHaveBeenCalledTimes(1)
      expect(mockDiagnosticRepository.get).toHaveBeenCalledWith(
        patientId,
        clinicId,
      )
    })

    it('should return the diagnostic data from the repository if it exists', async () => {
      const diagnosticData = {
        patientId: 'patientId',
        diagnostic: 'diagnostic',
        treatmentPlan: 'treatmentPlan',
      }
      mockDiagnosticRepository.get.mockResolvedValue(diagnosticData)

      const result = await getDiagnosticUseCase.execute('patientId', 'clinicId')

      expect(result).toBe(diagnosticData)
    })

    it('should return an empty object if the diagnostic data does not exist', async () => {
      mockDiagnosticRepository.get.mockResolvedValue(undefined as any)

      const result = await getDiagnosticUseCase.execute('patientId', 'clinicId')

      expect(result).toEqual({})
    })

    it('should propagate an error if the repository Get method throws', async () => {
      const DiagnosticId = 'test-Diagnostic-id'
      const clinicId = 'test-user-id'
      const errorMessage = 'Failed to Get Diagnostic'

      mockDiagnosticRepository.get.mockRejectedValueOnce(
        new Error(errorMessage),
      )

      await expect(
        getDiagnosticUseCase.execute(DiagnosticId, clinicId),
      ).rejects.toThrow(errorMessage)
    })
  })
})

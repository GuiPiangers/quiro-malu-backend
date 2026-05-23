import { createMockDiagnosticRepository } from '../../../../../repositories/_mocks/DiagnosticRepositoryMock'
import { SetDiagnosticUseCase } from './SetDiagnosticUseCase'

describe('setDiagnosticUseCase', () => {
  let setDiagnosticUseCase: SetDiagnosticUseCase
  const mockDiagnosticRepository = createMockDiagnosticRepository()

  beforeEach(() => {
    vi.clearAllMocks()
    setDiagnosticUseCase = new SetDiagnosticUseCase(mockDiagnosticRepository)
  })

  describe('execute', () => {
    it('should call the repository Save method with the correct Data if diagnostic does not exist', async () => {
      const patientId = 'test-patient-id'
      const clinicId = 'test-user-id'
      const diagnostic = 'test-diagnostic'
      const treatmentPlan = 'test-treatment-plan'

      mockDiagnosticRepository.get.mockResolvedValue(undefined as any)

      await setDiagnosticUseCase.execute(
        { patientId, diagnostic, treatmentPlan },
        clinicId,
      )

      expect(mockDiagnosticRepository.save).toHaveBeenCalledTimes(1)
      expect(mockDiagnosticRepository.save).toHaveBeenCalledWith(
        {
          patientId,
          diagnostic,
          treatmentPlan,
        },
        clinicId,
      )
    })

    it('should Update data if optional params were not passed', async () => {
      const patientId = 'test-patient-id'
      const clinicId = 'test-user-id'

      mockDiagnosticRepository.get.mockResolvedValue({ patientId })

      await setDiagnosticUseCase.execute({ patientId }, clinicId)

      expect(mockDiagnosticRepository.update).toHaveBeenCalledTimes(1)
      expect(mockDiagnosticRepository.update).toHaveBeenCalledWith(
        {
          patientId,
        },
        clinicId,
      )
    })

    it('should Save data if optional params were not passed', async () => {
      const patientId = 'test-patient-id'
      const clinicId = 'test-user-id'

      mockDiagnosticRepository.get.mockResolvedValue(undefined as any)

      await setDiagnosticUseCase.execute({ patientId }, clinicId)

      expect(mockDiagnosticRepository.save).toHaveBeenCalledTimes(1)
      expect(mockDiagnosticRepository.save).toHaveBeenCalledWith(
        {
          patientId,
        },
        clinicId,
      )
    })

    it('should call the repository Update method with the correct Data if diagnostic does not exist', async () => {
      const patientId = 'test-patient-id'
      const clinicId = 'test-user-id'
      const diagnostic = 'test-diagnostic'
      const treatmentPlan = 'test-treatment-plan'

      mockDiagnosticRepository.get.mockResolvedValue({ patientId })

      await setDiagnosticUseCase.execute(
        { patientId, diagnostic, treatmentPlan },
        clinicId,
      )

      expect(mockDiagnosticRepository.update).toHaveBeenCalledTimes(1)
      expect(mockDiagnosticRepository.update).toHaveBeenCalledWith(
        {
          patientId,
          diagnostic,
          treatmentPlan,
        },
        clinicId,
      )
    })

    it('should propagate an error if the repository set method throws', async () => {
      const patientId = 'test-patient-id'
      const clinicId = 'test-user-id'
      const errorMessage = 'Failed to set patient'

      mockDiagnosticRepository.get.mockRejectedValueOnce(
        new Error(errorMessage),
      )

      await expect(
        setDiagnosticUseCase.execute({ patientId }, clinicId),
      ).rejects.toThrow(errorMessage)
    })
  })
})

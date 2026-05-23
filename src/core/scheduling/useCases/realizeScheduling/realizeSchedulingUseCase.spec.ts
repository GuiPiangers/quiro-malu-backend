import { RealizeSchedulingUseCase } from './realizeSchedulingUseCase'
import { IProgressRepository } from '../../../../repositories/progress/IProgressRepository'
import { ProgressDTO } from '../../../patients/models/Progress'
import { ApiError } from '../../../../utils/ApiError'
import { createMockSchedulingRepository } from '../../../../repositories/_mocks/SchedulingRepositoryMock'

const mockedProgressRepository = {
  getByScheduling: vi.fn(),
}

describe('Realize scheduling use case', () => {
  let realizeSchedulingUseCase: RealizeSchedulingUseCase
  const mockSchedulingRepository = createMockSchedulingRepository()

  beforeEach(() => {
    vi.clearAllMocks()
    realizeSchedulingUseCase = new RealizeSchedulingUseCase(
      mockSchedulingRepository,
      mockedProgressRepository as unknown as IProgressRepository,
    )
  })

  it('Should be able to set scheduling Realized if a progress has been associated to scheduling', async () => {
    const realizeSchedulingData = {
      clinicId: 'clinicId1',
      patientId: 'patientId1',
      schedulingId: 'schedulingId1',
    }

    mockedProgressRepository.getByScheduling.mockResolvedValue([
      {
        patientId: realizeSchedulingData.patientId,
        schedulingId: realizeSchedulingData.schedulingId,
      } as ProgressDTO,
    ])

    mockSchedulingRepository.update.mockResolvedValue(undefined)

    const result = await realizeSchedulingUseCase.execute(
      realizeSchedulingData,
    )

    expect(mockedProgressRepository.getByScheduling).toHaveBeenCalledWith({
      schedulingId: realizeSchedulingData.schedulingId,
      patientId: realizeSchedulingData.patientId,
      clinicId: realizeSchedulingData.clinicId,
    })

    expect(mockSchedulingRepository.update).toHaveBeenCalledWith({
      id: realizeSchedulingData.schedulingId,
      clinicId: realizeSchedulingData.clinicId,
      status: 'Atendido',
    })

    expect(result).toBeUndefined()
  })
  it('Should throw an error if try to realize a scheduling without a progress has been associated to scheduling', async () => {
    const realizeSchedulingData = {
      clinicId: 'clinicId1',
      patientId: 'patientId1',
      schedulingId: 'schedulingId1',
    }

    mockedProgressRepository.getByScheduling.mockResolvedValue([])

    await expect(
      realizeSchedulingUseCase.execute(realizeSchedulingData),
    ).rejects.toThrow(ApiError)

    try {
      await realizeSchedulingUseCase.execute(realizeSchedulingData)
    } catch (error: unknown) {
      expect((error as ApiError).message).toBe(
        'A evolução deve ser salva para poder realizar a consulta',
      )
      expect((error as ApiError).statusCode).toBe(424)
    }

    expect(mockSchedulingRepository.update).not.toHaveBeenCalled()
  })

  it('should propagate an error if the scheduling repository update method throws', async () => {
    const clinicId = 'test-clinic-id'
    const patientId = 'test-patient-id'
    const schedulingId = 'test-scheduling-id'
    const errorMessage = 'Failed to listQtdSchedulesByDay'

    mockedProgressRepository.getByScheduling.mockResolvedValue([
      {
        patientId,
        schedulingId,
      } as ProgressDTO,
    ])
    mockSchedulingRepository.update.mockRejectedValue(new Error(errorMessage))

    await expect(
      realizeSchedulingUseCase.execute({ clinicId, patientId, schedulingId }),
    ).rejects.toThrow(errorMessage)
  })

  it('should propagate an error if the progress repository getByScheduling method throws', async () => {
    const clinicId = 'test-clinic-id'
    const patientId = 'test-patient-id'
    const schedulingId = 'test-scheduling-id'
    const errorMessage = 'Failed to listQtdSchedulesByDay'

    mockedProgressRepository.getByScheduling.mockRejectedValue(
      new Error(errorMessage),
    )

    await expect(
      realizeSchedulingUseCase.execute({ clinicId, patientId, schedulingId }),
    ).rejects.toThrow(errorMessage)
  })
})

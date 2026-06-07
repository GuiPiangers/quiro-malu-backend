import { createMockBlockScheduleRepository } from '../../../../repositories/_mocks/BlockScheduleRepositoryMock'
import { createMockSchedulingRepository } from '../../../../repositories/_mocks/SchedulingRepositoryMock'
import { createMockClinicianRepository } from '../../../../repositories/_mocks/ClinicianRepositoryMock'
import { ApiError } from '../../../../utils/ApiError'
import { DateTime } from '../../../shared/Date'
import { BlockSchedule } from '../../models/BlockSchedule'
import type { Clinician } from '../../../clinician/models/Clinician'
import { IAppEventListener } from '../../../shared/observers/EventListener'
import {
  UpdateSchedulingInput,
  UpdateSchedulingUseCase,
} from './UpdateSchedulingUseCase'

const eventsStub: IAppEventListener = { emit: vi.fn() }

const defaultExistingSchedule = {
  id: 'test-Scheduling-id',
  userId: 'test-user-id',
  patientId: 'test-patient-id',
  date: '2025-01-10T00:00',
  duration: 3600,
  status: 'Agendado' as const,
  service: 'Quiropraxia',
  patient: 'Paciente',
  phone: '(11) 91111-1111',
}

describe('updateSchedulingUseCase', () => {
  let updateSchedulingUseCase: UpdateSchedulingUseCase
  const mockSchedulingRepository = createMockSchedulingRepository()
  const mockBlockScheduleRepository = createMockBlockScheduleRepository()
  const mockClinicianRepository = createMockClinicianRepository()

  describe('execute', () => {
    beforeAll(() => {
      vi.useFakeTimers().setSystemTime(
        new Date('2025-01-10T12:00:00Z').getTime(),
      )
    })

    beforeEach(() => {
      vi.clearAllMocks()
      mockBlockScheduleRepository.listBetweenDates.mockResolvedValue([])
      mockClinicianRepository.findById.mockResolvedValue({} as Clinician)
      updateSchedulingUseCase = new UpdateSchedulingUseCase(
        mockSchedulingRepository,
        mockBlockScheduleRepository,
        mockClinicianRepository,
        eventsStub,
      )
      mockSchedulingRepository.get.mockResolvedValue([
        { ...defaultExistingSchedule } as any,
      ])
    })

    it('should call the repository update method with the correct Data', async () => {
      const patientId = 'test-patient-id'

      const schedulingData: UpdateSchedulingInput = {
        clinicId: 'test-clinic-id',
        requestUserId: 'request-user-id',
        eventsWriteScope: { type: 'all' },
        id: 'test-Scheduling-id',
        patientId,
        date: '2025-01-10T00:00',
        duration: 3600,
        status: 'Atendido',
        service: 'Quiropraxia',
      }

      mockSchedulingRepository.list.mockResolvedValue([])

      const result = await updateSchedulingUseCase.execute(schedulingData)

      expect(mockSchedulingRepository.get).toHaveBeenCalledWith({
        id: 'test-Scheduling-id',
        clinicId: 'test-clinic-id',
      })
      expect(mockClinicianRepository.findById).toHaveBeenCalledWith({
        id: 'test-user-id',
        clinicId: 'test-clinic-id',
      })
      expect(mockSchedulingRepository.update).toHaveBeenCalledTimes(1)
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          clinicId: 'test-clinic-id',
          id: schedulingData.id,
          userId: 'test-user-id',
          patientId: schedulingData.patientId,
          date: schedulingData.date,
          duration: schedulingData.duration,
          status: schedulingData.status,
          service: schedulingData.service,
        }),
      )
      expect(result.userId).toBe('test-user-id')
    })

    it('should update userId when a new clinician is informed in the body', async () => {
      const newClinicianId = 'new-clinician-id'

      mockSchedulingRepository.list.mockResolvedValue([])

      const result = await updateSchedulingUseCase.execute({
        clinicId: 'test-clinic-id',
        requestUserId: 'test-user-id',
        eventsWriteScope: { type: 'all' },
        id: 'test-Scheduling-id',
        patientId: 'test-patient-id',
        userId: newClinicianId,
      })

      expect(mockClinicianRepository.findById).toHaveBeenCalledWith({
        id: newClinicianId,
        clinicId: 'test-clinic-id',
      })
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ userId: newClinicianId }),
      )
      expect(result.userId).toBe(newClinicianId)
    })

    it('should throw when current scheduling user is not a clinician and no new userId is informed', async () => {
      mockClinicianRepository.findById.mockResolvedValue(null)

      await expect(
        updateSchedulingUseCase.execute({
          clinicId: 'test-clinic-id',
          id: 'test-Scheduling-id',
          patientId: 'test-patient-id',
        }),
      ).rejects.toMatchObject({
        message: 'O usuário informado não é um clínico',
        statusCode: 400,
      })

      expect(mockSchedulingRepository.update).not.toHaveBeenCalled()
    })

    it('should throw when informed userId is not a clinician', async () => {
      mockClinicianRepository.findById.mockResolvedValue(null)

      await expect(
        updateSchedulingUseCase.execute({
          clinicId: 'test-clinic-id',
          id: 'test-Scheduling-id',
          patientId: 'test-patient-id',
          userId: 'invalid-clinician-id',
        }),
      ).rejects.toMatchObject({
        message: 'O usuário informado não é um clínico',
        statusCode: 400,
      })

      expect(mockSchedulingRepository.update).not.toHaveBeenCalled()
    })

    it('should call the repository update method with status param equal Atrasado if date is in the past and status is Agendado, Atrasado or undefined', async () => {
      const patientId = 'test-patient-id'

      const schedulingData: UpdateSchedulingInput = {
        clinicId: 'test-clinic-id',
        requestUserId: 'test-user-id',
        eventsWriteScope: { type: 'all' },
        id: 'test-Scheduling-id',
        patientId,
        date: '2025-01-11T00:00',
        duration: 3600,
        status: 'Agendado',
        service: 'Quiropraxia',
      }

      mockSchedulingRepository.get.mockResolvedValue([
        { ...defaultExistingSchedule, date: '2025-01-11T00:00' } as any,
      ])
      mockSchedulingRepository.list.mockResolvedValue([])

      await updateSchedulingUseCase.execute(schedulingData)
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: 'Atrasado',
      })
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: undefined,
      })

      expect(mockSchedulingRepository.update).toHaveBeenCalled()
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          clinicId: 'test-clinic-id',
          id: schedulingData.id,
          userId: 'test-user-id',
          patientId: schedulingData.patientId,
          date: schedulingData.date,
          duration: schedulingData.duration,
          status: 'Agendado',
          service: schedulingData.service,
        }),
      )
    })

    it('should call the repository update method with status param equal Agendado if date is in the past and status is Agendado, Atrasado or undefined', async () => {
      const patientId = 'test-patient-id'

      const schedulingData: UpdateSchedulingInput = {
        clinicId: 'test-clinic-id',
        requestUserId: 'test-user-id',
        eventsWriteScope: { type: 'all' },
        id: 'test-Scheduling-id',
        patientId,
        date: '2025-01-09T00:00',
        duration: 3600,
        status: 'Agendado',
        service: 'Quiropraxia',
      }

      mockSchedulingRepository.get.mockResolvedValue([
        { ...defaultExistingSchedule, date: '2025-01-09T00:00' } as any,
      ])
      mockSchedulingRepository.list.mockResolvedValue([])

      await updateSchedulingUseCase.execute(schedulingData)
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: 'Atrasado',
      })
      await updateSchedulingUseCase.execute({
        ...schedulingData,
        status: undefined,
      })

      expect(mockSchedulingRepository.update).toHaveBeenCalled()
      expect(mockSchedulingRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          clinicId: 'test-clinic-id',
          id: schedulingData.id,
          userId: 'test-user-id',
          patientId: schedulingData.patientId,
          date: schedulingData.date,
          duration: schedulingData.duration,
          status: 'Agendado',
          service: schedulingData.service,
        }),
      )
    })

    it('should throw an ApiError if scheduling is not available', async () => {
      const patientId = 'test-patient-id'

      const schedulingData: UpdateSchedulingInput = {
        clinicId: 'test-clinic-id',
        requestUserId: 'test-user-id',
        eventsWriteScope: { type: 'all' },
        id: 'test-Scheduling-id',
        patientId,
        date: '2025-01-10T14:00',
        duration: 3600,
        status: 'Atendido',
        service: 'Quiropraxia',
      }

      mockSchedulingRepository.get.mockResolvedValue([
        {
          ...defaultExistingSchedule,
          date: '2025-01-10T14:00',
          status: 'Atendido',
        } as any,
      ])

      mockSchedulingRepository.list.mockResolvedValue([
        {
          duration: 3600,
          patientId: 'test-patient-id-2',
          id: 'test-Scheduling-id-2',
          date: '2025-01-10T14:30',
          patient: 'Lucas Fernando',
          phone: '(99) 99999 9999',
        },
      ])

      const responsePromise = updateSchedulingUseCase.execute(schedulingData)

      expect(responsePromise).rejects.toThrow(ApiError)
      expect(mockSchedulingRepository.update).not.toHaveBeenCalled()
    })

    it('should not validate if is available if date param is not passed to be updated', async () => {
      const patientId = 'test-patient-id'

      const schedulingData: UpdateSchedulingInput = {
        clinicId: 'test-clinic-id',
        requestUserId: 'test-user-id',
        eventsWriteScope: { type: 'all' },
        id: 'test-Scheduling-id',
        patientId,
        duration: 3600,
        status: 'Atendido',
        service: 'Quiropraxia',
      }

      mockSchedulingRepository.get.mockResolvedValue([
        {
          id: 'test-Scheduling-id',
          userId: 'test-user-id',
          patientId,
          duration: 3600,
          status: 'Agendado',
          service: 'Quiropraxia',
          patient: 'Paciente',
          phone: '(11) 91111-1111',
        } as any,
      ])

      await updateSchedulingUseCase.execute(schedulingData)

      expect(mockSchedulingRepository.list).not.toHaveBeenCalled()
      expect(
        mockBlockScheduleRepository.listBetweenDates,
      ).not.toHaveBeenCalled()
      expect(mockSchedulingRepository.update).toBeCalled()
    })

    it('should throw an ApiError if update overlaps with block scheduling event', async () => {
      const patientId = 'test-patient-id'

      const blockScheduling = new BlockSchedule({
        date: new DateTime('2025-01-10T14:00'),
        endDate: new DateTime('2025-02-10T14:00'),
        description: 'evento',
      })

      mockBlockScheduleRepository.listBetweenDates.mockResolvedValue([
        blockScheduling,
      ])

      const schedulingData: UpdateSchedulingInput = {
        clinicId: 'test-clinic-id',
        requestUserId: 'test-user-id',
        eventsWriteScope: { type: 'all' },
        id: 'test-Scheduling-id',
        patientId,
        date: '2025-01-10T14:00',
        duration: 3600,
        status: 'Agendado',
        service: 'Quiropraxia',
      }

      mockSchedulingRepository.list.mockResolvedValue([])

      await expect(
        updateSchedulingUseCase.execute(schedulingData),
      ).rejects.toThrow(
        `O horário informado está bloqueado por um evento ${blockScheduling.description}`,
      )
      expect(mockSchedulingRepository.update).not.toHaveBeenCalled()
    })

    it('should throw an ApiError if schedulingId parameter is not passed', async () => {
      const patientId = 'test-patient-id'

      const schedulingData: UpdateSchedulingInput = {
        clinicId: 'test-clinic-id',
        patientId,
        date: '2025-01-10T14:00',
        duration: 3600,
        status: 'Atendido',
        service: 'Quiropraxia',
      }

      await expect(
        updateSchedulingUseCase.execute(schedulingData),
      ).rejects.toThrow(ApiError)

      expect(mockSchedulingRepository.get).not.toHaveBeenCalled()
    })

    it('should throw ApiError Agendamento não encontrado when scheduling does not exist', async () => {
      mockSchedulingRepository.get.mockResolvedValue([])

      await expect(
        updateSchedulingUseCase.execute({
          clinicId: 'test-clinic-id',
          id: 'non-existent-scheduling-id',
          patientId: 'test-patient-id',
          date: '2025-01-10T00:00',
          duration: 3600,
          status: 'Agendado',
          service: 'Quiropraxia',
        }),
      ).rejects.toMatchObject({
        message: 'Agendamento não encontrado',
        statusCode: 404,
      })

      expect(mockSchedulingRepository.update).not.toHaveBeenCalled()
    })

    it('should throw when effective userId is outside events write scope', async () => {
      mockSchedulingRepository.list.mockResolvedValue([])

      await expect(
        updateSchedulingUseCase.execute({
          clinicId: 'test-clinic-id',
          id: 'test-Scheduling-id',
          patientId: 'test-patient-id',
          userId: 'other-clinician-id',
          requestUserId: 'test-user-id',
          eventsWriteScope: { type: 'own' },
        }),
      ).rejects.toMatchObject({
        message: 'Acesso negado.',
        statusCode: 403,
      })

      expect(mockSchedulingRepository.update).not.toHaveBeenCalled()
    })

    it('should propagate an error if the repository update method throws', async () => {
      const patientId = 'test-patient-id'
      const errorMessage = 'Failed to update patient'

      mockSchedulingRepository.list.mockRejectedValueOnce(
        new Error(errorMessage),
      )

      mockSchedulingRepository.list.mockRejectedValueOnce(
        new Error('O id deve ser informado'),
      )

      await expect(
        updateSchedulingUseCase.execute({
          id: 'test-Scheduling-id',
          patientId,
          clinicId: 'test-clinic-id',
          date: '2025-01-10T00:00',
          duration: 3600,
        }),
      ).rejects.toThrow(errorMessage)
    })
  })
})

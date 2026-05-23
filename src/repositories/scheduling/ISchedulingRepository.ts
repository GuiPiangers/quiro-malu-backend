import {
  Scheduling,
  SchedulingDTO,
} from '../../core/scheduling/models/Scheduling'
import { SchedulingWithPatientDTO } from '../../core/scheduling/models/SchedulingWithPatient'
import { DateTime } from '../../core/shared/Date'

export type UpdateSchedulingParams = Partial<SchedulingDTO> & {
  clinicId: string
  id: string
}

export type ListBetweenDatesParams = {
  clinicId: string
  startDate: DateTime
  endDate: DateTime
}

export interface ISchedulingRepository {
  save(
    data: SchedulingDTO & { userId: string; clinicId: string },
  ): Promise<void>

  update(data: UpdateSchedulingParams): Promise<void>

  list(data: {
    clinicId: string
    date: string
    /** Quando informado, restringe aos agendamentos desse profissional. */
    userId?: string
    config?: { limit: number; offSet: number }
  }): Promise<SchedulingWithPatientDTO[]>

  listBetweenDates(data: ListBetweenDatesParams): Promise<Scheduling[]>

  count(data: { clinicId: string; date: string }): Promise<[{ total: number }]>

  qdtSchedulesByDay(data: {
    month: number
    year: number
    clinicId: string
    userId: string
  }): Promise<{ formattedDate: string; qtd: number }[]>

  get(data: {
    id: string
    clinicId: string
  }): Promise<SchedulingWithPatientDTO[]>

  listIdsByClinicId(data: { clinicId: string }): Promise<string[]>

  listPatientIdsByClinicIdOrderBySchedulingCountDesc(
    clinicId: string,
    limit: number,
  ): Promise<string[]>

  delete(data: { id: string; clinicId: string }): Promise<void>
}

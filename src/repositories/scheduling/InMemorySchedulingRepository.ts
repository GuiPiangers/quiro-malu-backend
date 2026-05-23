import {
  Scheduling,
  SchedulingDTO,
} from '../../core/scheduling/models/Scheduling'
import { SchedulingWithPatientDTO } from '../../core/scheduling/models/SchedulingWithPatient'
import { DateTime } from '../../core/shared/Date'
import {
  ISchedulingRepository,
  ListBetweenDatesParams,
  UpdateSchedulingParams,
} from './ISchedulingRepository'

type InMemorySchedule = SchedulingWithPatientDTO & {
  userId: string
  clinicId: string
}

export class InMemorySchedulingRepository implements ISchedulingRepository {
  private dbSchedules: InMemorySchedule[] = []

  async listBetweenDates(data: ListBetweenDatesParams): Promise<Scheduling[]> {
    return this.dbSchedules
      .filter((s) => s.clinicId === data.clinicId)
      .map((s) => new Scheduling(s))
  }

  async qdtSchedulesByDay(data: {
    month: number
    year: number
    clinicId: string
    userId: string
  }): Promise<{ formattedDate: string; qtd: number }[]> {
    const counts = new Map<string, number>()

    for (const schedule of this.dbSchedules) {
      if (schedule.clinicId !== data.clinicId) continue
      if (schedule.userId !== data.userId) continue
      if (!schedule.date) continue

      const date = new Date(String(schedule.date))
      if (
        date.getMonth() + 1 !== data.month ||
        date.getFullYear() !== data.year
      ) {
        continue
      }

      const formattedDate = String(schedule.date).substring(0, 10)
      counts.set(formattedDate, (counts.get(formattedDate) ?? 0) + 1)
    }

    return [...counts.entries()].map(([formattedDate, qtd]) => ({
      formattedDate,
      qtd,
    }))
  }

  async count(data: {
    clinicId: string
    date: string
  }): Promise<[{ total: number }]> {
    const total = this.dbSchedules.filter((s) => {
      if (s.clinicId !== data.clinicId) return false
      if (!s.date) return false
      return String(s.date).substring(0, 10) === data.date
    }).length

    return [{ total }]
  }

  async delete({
    id,
    clinicId,
  }: {
    id: string
    clinicId: string
  }): Promise<void> {
    this.dbSchedules = this.dbSchedules.filter(
      (scheduling) =>
        !(scheduling.id === id && scheduling.clinicId === clinicId),
    )
  }

  async update({ clinicId, ...data }: UpdateSchedulingParams): Promise<void> {
    const index = this.dbSchedules.findIndex((scheduling) => {
      return scheduling.clinicId === clinicId && scheduling.id === data.id
    })

    if (index === -1) return

    this.dbSchedules[index] = {
      ...(this.dbSchedules[index] as InMemorySchedule),
      ...(data as any),
      clinicId,
    }
  }

  async save({
    userId,
    clinicId,
    ...data
  }: SchedulingDTO & { userId: string; clinicId: string }): Promise<void> {
    this.dbSchedules.push({
      ...(data as any),
      userId,
      clinicId,
      patient: '',
      phone: '',
    })
  }

  async list(data: {
    clinicId: string
    date: string
    userId?: string
    config?: { limit: number; offSet: number }
  }): Promise<SchedulingWithPatientDTO[]> {
    const list = this.dbSchedules.filter((scheduling) => {
      if (scheduling.clinicId !== data.clinicId) return false
      if (
        data.userId !== undefined &&
        data.userId !== '' &&
        scheduling.userId !== data.userId
      ) {
        return false
      }
      if (!scheduling.date) return false
      return String(scheduling.date).substring(0, 10) === data.date
    })

    if (!data.config) return list

    return list.slice(
      data.config.offSet,
      data.config.offSet + data.config.limit,
    )
  }

  async listIdsByClinicId({
    clinicId,
  }: {
    clinicId: string
  }): Promise<string[]> {
    const now = Date.now()
    return this.dbSchedules
      .filter((s) => {
        if (s.clinicId !== clinicId || !s.date) return false
        const t = new Date(s.date).getTime()
        return !Number.isNaN(t) && t > now
      })
      .map((s) => s.id!)
      .filter(Boolean)
  }

  async listPatientIdsByClinicIdOrderBySchedulingCountDesc(
    clinicId: string,
    limit: number,
  ): Promise<string[]> {
    const filtered = this.dbSchedules.filter((s) => {
      if (s.clinicId !== clinicId || !s.patientId) return false
      if (s.status === 'Cancelado') return false
      return true
    })

    const byPatient = new Map<string, { count: number; tieBreak: string }>()

    for (const s of filtered) {
      const pid = String(s.patientId)
      const cur = byPatient.get(pid) ?? { count: 0, tieBreak: '' }
      cur.count += 1
      const schedCreated = s.createAt ? String(s.createAt) : ''
      if (schedCreated > cur.tieBreak) {
        cur.tieBreak = schedCreated
      }
      byPatient.set(pid, cur)
    }

    const entries = [...byPatient.entries()].sort((a, b) => {
      if (b[1].count !== a[1].count) {
        return b[1].count - a[1].count
      }
      const tie = b[1].tieBreak.localeCompare(a[1].tieBreak)
      if (tie !== 0) return tie
      return b[0].localeCompare(a[0])
    })

    return entries.slice(0, limit).map(([id]) => id)
  }

  async get(data: {
    id: string
    clinicId: string
  }): Promise<SchedulingWithPatientDTO[]> {
    return this.dbSchedules.filter(
      (scheduling) =>
        scheduling.id === data.id && scheduling.clinicId === data.clinicId,
    )
  }
}

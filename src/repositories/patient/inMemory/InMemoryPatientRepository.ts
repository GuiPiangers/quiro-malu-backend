import { PatientDTO } from '../../../core/patients/models/Patient'
import { IPatientRepository } from '../IPatientRepository'

type InMemoryPatient = PatientDTO & {
  clinicId: string
  createdAt: number
}

export class InMemoryPatientRepository implements IPatientRepository {
  private dbPatients: InMemoryPatient[] = []

  async getByBirthMonthAndDay(data: {
    birthMonth: number
    birthDay: number
    clinicId?: string
  }): Promise<(PatientDTO & { clinicId: string })[]> {
    return this.dbPatients.filter((patient) => {
      if (data.clinicId && patient.clinicId !== data.clinicId) return false
      if (!patient.dateOfBirth) return false
      const m = `${patient.dateOfBirth}`.match(/^(\d{4})-(\d{2})-(\d{2})/)
      if (!m) return false
      return Number(m[2]) === data.birthMonth && Number(m[3]) === data.birthDay
    })
  }

  async saveMany(
    patient: (PatientDTO & { clinicId: string })[],
  ): Promise<void> {
    patient.forEach((p) => {
      this.dbPatients.push({ ...p, createdAt: Date.now() })
    })
  }

  async getByHash(hashData: string, clinicId: string): Promise<PatientDTO> {
    return this.dbPatients.find(
      (patient) =>
        patient.clinicId === clinicId && patient.hashData === hashData,
    ) as PatientDTO
  }

  async countAll(
    clinicId: string,
    search?: { name?: string },
  ): Promise<[{ total: number }]> {
    const total = this.dbPatients.filter((patient) => {
      if (patient.clinicId !== clinicId) return false
      if (!search?.name) return true
      return patient.name.includes(search.name)
    }).length

    return [{ total }]
  }

  async delete(patientId: string, clinicId: string): Promise<void> {
    this.dbPatients = this.dbPatients.filter(
      (patient) => !(patient.id === patientId && patient.clinicId === clinicId),
    )
  }

  async update(
    data: PatientDTO,
    patientId: string,
    clinicId: string,
  ): Promise<void> {
    const index = this.dbPatients.findIndex((patient) => {
      return patient.clinicId === clinicId && patient.id === patientId
    })

    if (index < 0) return

    this.dbPatients[index] = {
      ...this.dbPatients[index],
      ...data,
    } as InMemoryPatient
  }

  async getByCpf(cpf: string, clinicId: string): Promise<PatientDTO[]> {
    return this.dbPatients.filter((patient) => {
      return patient.clinicId === clinicId && patient.cpf === cpf
    })
  }

  async save(patient: PatientDTO, clinicId: string): Promise<void> {
    this.dbPatients.push({ ...patient, clinicId, createdAt: Date.now() })
  }

  async getAll(
    clinicId: string,
    config: {
      limit: number
      offSet: number
      search?: { name?: string }
      orderBy?: { field: string; orientation: 'ASC' | 'DESC' }[]
    },
  ): Promise<PatientDTO[]> {
    const list = this.dbPatients.filter((patient) => {
      if (patient.clinicId !== clinicId) return false
      if (!config.search?.name) return true
      return patient.name.includes(config.search.name)
    })

    return list.slice(config.offSet, config.offSet + config.limit)
  }

  async getById(id: string, clinicId: string): Promise<PatientDTO[]> {
    return this.dbPatients.filter((patient) => {
      return patient.id === id && patient.clinicId === clinicId
    })
  }

  async getMostRecent(clinicId: string, limit: number): Promise<PatientDTO[]> {
    const safeLimit = Math.min(Math.max(limit, 0), 100)

    return this.dbPatients
      .filter((p) => p.clinicId === clinicId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, safeLimit)
  }

  async listPatientsById(data: {
    clinicId: string
    patientIds: string[]
  }): Promise<PatientDTO[]> {
    if (data.patientIds.length === 0) {
      return []
    }

    const byId = new Map(
      this.dbPatients
        .filter(
          (p) =>
            p.clinicId === data.clinicId &&
            p.id !== undefined &&
            data.patientIds.includes(p.id),
        )
        .map((p) => [p.id as string, p] as const),
    )

    return data.patientIds
      .map((id) => byId.get(id))
      .filter((p): p is InMemoryPatient => p !== undefined)
  }

  async countPatientsOwnedByUser(data: {
    clinicId: string
    patientIds: string[]
  }): Promise<number> {
    if (data.patientIds.length === 0) {
      return 0
    }
    const unique = [...new Set(data.patientIds)]
    let n = 0
    for (const id of unique) {
      const found = this.dbPatients.some(
        (p) => p.clinicId === data.clinicId && p.id === id,
      )
      if (found) n += 1
    }
    return n
  }
}

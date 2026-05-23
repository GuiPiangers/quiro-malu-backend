import { ProgressDTO } from '../../core/patients/models/Progress'
import { IProgressRepository } from './IProgressRepository'

export class InMemoryProgress implements IProgressRepository {
  getByScheduling(data: {
    schedulingId: string;
    patientId: string;
    clinicId: string;
  }): Promise<ProgressDTO[]> {
    const rows = this.dbProgress.filter(
      (progress) =>
        progress.schedulingId === data.schedulingId &&
        progress.patientId === data.patientId &&
        progress.clinicId === data.clinicId,
    )
    return Promise.resolve(rows)
  }

  private dbProgress: (ProgressDTO & { patientId: string; clinicId: string })[] =
    []

  async count(data: {
    patientId: string;
    clinicId: string;
  }): Promise<[{ total: number }]> {
    const total = this.dbProgress.filter(
      (progress) =>
        progress.patientId === data.patientId &&
        progress.clinicId === data.clinicId,
    ).length

    return [{ total }]
  }

  async save({
    patientId,
    clinicId,
    ...data
  }: ProgressDTO & { clinicId: string }): Promise<void> {
    this.dbProgress.push({ ...data, patientId, clinicId })
  }

  async update({
    id,
    patientId,
    clinicId,
    ...data
  }: ProgressDTO & { clinicId: string }): Promise<void> {
    const index = this.dbProgress.findIndex((progress) => {
      return (
        progress.patientId === patientId &&
        progress.clinicId === clinicId &&
        progress.id === id
      )
    })
    this.dbProgress[index] = {
      ...data,
      patientId,
      clinicId: this.dbProgress[index].clinicId,
    }
  }

  async get({
    id,
    patientId,
    clinicId,
  }: {
    id: string;
    patientId: string;
    clinicId: string;
  }): Promise<ProgressDTO[]> {
    const selectedUser = await this.dbProgress.find(
      (progress) =>
        progress.id === id &&
        progress.patientId === patientId &&
        progress.clinicId === clinicId,
    )

    if (selectedUser) return [selectedUser]
    return []
  }

  async list({
    patientId,
    clinicId,
    config,
  }: {
    patientId: string;
    clinicId: string;
    config?: { limit: number; offSet: number };
  }): Promise<ProgressDTO[]> {
    const selectedUser = this.dbProgress.filter(
      (progress) =>
        progress.patientId === patientId && progress.clinicId === clinicId,
    )

    if (config) {
      return selectedUser.slice(config.offSet, config.offSet + config.limit)
    }

    return selectedUser
  }

  async delete({
    id,
    patientId,
    clinicId,
  }: {
    id: string;
    patientId: string;
    clinicId: string;
  }): Promise<void> {
    this.dbProgress = this.dbProgress.filter(
      (progress) =>
        !(
          progress.id === id &&
          progress.patientId === patientId &&
          progress.clinicId === clinicId
        ),
    )
  }
}

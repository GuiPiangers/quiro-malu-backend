import { ServiceDTO } from '../../core/service/models/Service'
import { IServiceRepository, listServiceProps } from './IServiceRepository'

interface inMemoryInterface extends ServiceDTO {
  clinicId: string;
}

export class InMemoryServiceRepository implements IServiceRepository {
  private dbServices: inMemoryInterface[] = []

  count({ clinicId }: { clinicId: string }): Promise<[{ total: number }]> {
    throw new Error('Method not implemented.')
  }

  async delete({ id, clinicId }: { id: string; clinicId: string }): Promise<void> {
    this.dbServices = this.dbServices.filter(
      (service) => !(service.id === id && service.clinicId === clinicId),
    )
  }

  async update({
    clinicId,
    ...data
  }: ServiceDTO & { clinicId: string }): Promise<void> {
    const index = this.dbServices.findIndex((service) => {
      return service.clinicId === clinicId && service.id === data.id
    })
    this.dbServices[index] = { ...data, clinicId }
  }

  async save({
    clinicId,
    ...data
  }: ServiceDTO & { clinicId: string }): Promise<void> {
    this.dbServices.push({ ...data, clinicId })
  }

  async list({ clinicId }: listServiceProps): Promise<ServiceDTO[]> {
    return this.dbServices.filter((Service) => Service.clinicId === clinicId)
  }

  async get({
    id,
    clinicId,
  }: {
    id: string;
    clinicId: string;
  }): Promise<ServiceDTO | null> {
    const service = this.dbServices.find(
      (s) => s.id === id && s.clinicId === clinicId,
    )
    return service ?? null
  }

  async getByName({
    name,
    clinicId,
  }: {
    name: string;
    clinicId: string;
  }): Promise<ServiceDTO[]> {
    const result = this.dbServices.filter(
      (service) => service.name === name && service.clinicId === clinicId,
    )
    return result
  }
}

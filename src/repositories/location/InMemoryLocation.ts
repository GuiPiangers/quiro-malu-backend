import { LocationDTO } from '../../core/shared/Location'
import { ILocationRepository } from './ILocationRepository'

export class InMemoryLocation implements ILocationRepository {
  saveMany(
    locations: (LocationDTO & { patientId: string; clinicId: string })[],
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }

  private dbLocation: (LocationDTO & { patientId: string; clinicId: string })[] =
    []

  async update(data: LocationDTO, patientId: string): Promise<void> {
    const index = this.dbLocation.findIndex((location) => {
      return location.patientId === patientId
    })
    this.dbLocation[index] = {
      ...data,
      patientId,
      clinicId: this.dbLocation[index].clinicId,
    }
  }

  async getLocation(patientId: string): Promise<LocationDTO[]> {
    const selectedUser = await this.dbLocation.find(
      (location) => location.patientId === patientId,
    )

    if (selectedUser) return [selectedUser]
    return []
  }

  async save(
    location: LocationDTO,
    patientId: string,
    clinicId: string,
  ): Promise<void> {
    this.dbLocation.push({ ...location, patientId, clinicId })
  }
}

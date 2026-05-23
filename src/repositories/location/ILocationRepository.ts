import { LocationDTO } from '../../core/shared/Location'

export interface ILocationRepository {
  save(
    location: LocationDTO,
    patientId: string,
    clinicId: string,
  ): Promise<void>
  saveMany(
    locations: (LocationDTO & { patientId: string; clinicId: string })[],
  ): Promise<void>
  update(data: LocationDTO, patientId: string, clinicId: string): Promise<void>
  getLocation(patientId: string, clinicId: string): Promise<LocationDTO[]>
}

import { ILocationRepository } from '../../../../repositories/location/ILocationRepository'
import { IPatientRepository } from '../../../../repositories/patient/IPatientRepository'

export class GetPatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private locationRepository: ILocationRepository,
  ) {}

  async execute(patientId: string, clinicId: string) {
    const getPatient = this.patientRepository.getById(patientId, clinicId)
    const getLocation = this.locationRepository.getLocation(patientId, clinicId)
    const [[patient], [location]] = await Promise.all([
      getPatient,
      getLocation,
    ])

    if (location) {
      return { ...patient, location }
    }
    return patient
  }
}

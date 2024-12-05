import { ILocationRepository } from "../../../../repositories/location/ILocationRepository";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";

export class GetPatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private locationRepository: ILocationRepository,
  ) {}

  async execute(patientId: string, userId: string) {
    const getPatient = this.patientRepository.getById(patientId, userId);
    const getLocation = this.locationRepository.getLocation(patientId, userId);
    const [[patient], [location]] = await Promise.all([
      getPatient,
      getLocation,
    ]);

    // console.log(location);

    if (location) {
      return { ...patient, location };
    }
    return patient;
  }
}

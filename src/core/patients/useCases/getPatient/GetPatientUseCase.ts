import { ILocationRepository } from "../../repositories/location/ILocatinRepository";
import { IPatientRepository } from "../../repositories/patient/IPatientRepository";

export class GetPatientUseCase {
    constructor(
        private patientRepository: IPatientRepository,
        private locationRepository: ILocationRepository
    ) { }

    async execute(patientId: string, userId: string) {
        const getPatient = this.patientRepository.getById(patientId, userId)
        const getLocation = this.locationRepository.getLocation(patientId)
        const [[patient], [location]] = await Promise.all([getPatient, getLocation])

        if (location) {
            return { location, ...patient }
        }
        return patient
    }
}
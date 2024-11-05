import { Patient, PatientDTO } from "../../models/Patient";
import { ILocationRepository } from "../../../../repositories/location/ILocationRepository";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../utils/ApiError";

export class UpdatePatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private locationRepository: ILocationRepository,
  ) {}

  async execute(data: PatientDTO, userId: string) {
    const patient = new Patient(data);
    const { location, id, ...patientDTO } = patient.getPatientDTO();

    if (patient.cpf) {
      const [verifyPatient] = await this.patientRepository.getByCpf(
        patient.cpf,
        userId,
      );
      if (verifyPatient.id && verifyPatient.id !== patient.id) {
        throw new ApiError("Já existe um usuário cadastrado com esse CPF", 400);
      }
    }

    const updatePatient = this.patientRepository.update(
      patientDTO,
      id!,
      userId,
    );

    if (location) {
      const [validateLocation] = await this.locationRepository.getLocation(
        id!,
        userId,
      );

      if (validateLocation) {
        const updateLocation = this.locationRepository.update(
          location,
          id!,
          userId,
        );
        await Promise.all([updatePatient, updateLocation]);
      } else {
        const saveLocation = this.locationRepository.save(
          location,
          id!,
          userId,
        );
        await Promise.all([updatePatient, saveLocation]);
      }
    } else {
      await updatePatient;
    }

    return patient;
  }
}

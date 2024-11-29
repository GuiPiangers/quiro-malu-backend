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

    await this.validateCpfNotExist({
      cpf: patientDTO.cpf,
      userId,
      patientId: patient.id,
    });

    const updatePatient = this.patientRepository.update(
      patientDTO,
      patient.id,
      userId,
    );

    if (
      location &&
      Object.values(location).some((value) => value !== undefined)
    ) {
      const [validateLocation] = await this.locationRepository.getLocation(
        patient.id,
        userId,
      );

      if (validateLocation) {
        const updateLocation = this.locationRepository.update(
          location,
          patient.id,
          userId,
        );
        await Promise.all([updatePatient, updateLocation]);
      } else {
        const saveLocation = this.locationRepository.save(
          location,
          patient.id,
          userId,
        );
        await Promise.all([updatePatient, saveLocation]);
      }
    } else {
      await updatePatient;
    }

    return patient;
  }

  private async validateCpfNotExist({
    cpf,
    patientId,
    userId,
  }: {
    cpf?: string;
    patientId: string;
    userId: string;
  }) {
    if (cpf) {
      const [verifyPatient] = await this.patientRepository.getByCpf(
        cpf,
        userId,
      );

      if (verifyPatient?.id && verifyPatient?.id !== patientId) {
        throw new ApiError("Já existe um usuário cadastrado com esse CPF", 400);
      }
    }
  }
}

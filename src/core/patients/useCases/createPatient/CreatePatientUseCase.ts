import { Patient, PatientDTO } from "../../models/Patient";
import { ILocationRepository } from "../../../../repositories/location/ILocationRepository";
import { IPatientRepository } from "../../../../repositories/patient/IPatientRepository";
import { ApiError } from "../../../../utils/ApiError";

export class CreatePatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private locationRepository: ILocationRepository,
  ) {}

  async execute(data: PatientDTO, userId: string) {
    const patient = new Patient(data);
    const { location, ...patientDTO } = patient.getPatientDTO();

    await Promise.all([
      this.validateCpfNotExist({ cpf: patientDTO.cpf, userId }),
      this.validatePatientExist(patient, userId),
    ]);

    await this.patientRepository.save(patientDTO, userId);

    if (location) {
      await this.locationRepository.save(location, patient.id, userId);
    }

    return patientDTO;
  }

  private async validateCpfNotExist({
    cpf,
    userId,
  }: {
    cpf?: string;
    userId: string;
  }) {
    if (cpf) {
      const [verifyCpf] = await this.patientRepository.getByCpf(cpf, userId);
      if (verifyCpf?.cpf === cpf)
        throw new ApiError(
          "Já existe um usuário cadastrado com esse CPF",
          400,
          "cpf",
        );
    }
  }

  private async validatePatientExist(patient: Patient, userId: string) {
    const patientExists = await this.patientRepository.getByHash(
      patient.hashData,
      userId,
    );

    if (patientExists?.hashData) {
      throw new ApiError(
        "Já existe um paciente cadastrado com esses dados",
        400,
      );
    }
  }
}

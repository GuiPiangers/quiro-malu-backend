import { Patient, PatientDTO } from '../../models/Patient'
import { ILocationRepository } from '../../../../repositories/location/ILocationRepository'
import { IPatientRepository } from '../../../../repositories/patient/IPatientRepository'
import { ApiError } from '../../../../utils/ApiError'

export class CreatePatientUseCase {
  constructor(
    private patientRepository: IPatientRepository,
    private locationRepository: ILocationRepository,
  ) {}

  async execute(data: PatientDTO, clinicId: string) {
    const patient = new Patient(data)
    const { location, ...patientDTO } = patient.getPatientDTO()

    await Promise.all([
      this.validateCpfNotExist({ cpf: patientDTO.cpf, clinicId }),
      this.validatePatientExist(patient, clinicId),
    ])
    await this.patientRepository.save(patientDTO, clinicId)

    if (location) {
      await this.locationRepository.save(location, patient.id, clinicId)
    }

    return patientDTO
  }

  private async validateCpfNotExist({
    cpf,
    clinicId,
  }: {
    cpf?: string;
    clinicId: string;
  }) {
    if (cpf) {
      const [verifyCpf] = await this.patientRepository.getByCpf(cpf, clinicId)
      if (verifyCpf?.cpf === cpf) {
        throw new ApiError(
          'Já existe um usuário cadastrado com esse CPF',
          400,
          'cpf',
        )
      }
    }
  }

  private async validatePatientExist(patient: Patient, clinicId: string) {
    const patientExists = await this.patientRepository.getByHash(
      patient.hashData,
      clinicId,
    )

    if (patientExists?.hashData) {
      throw new ApiError(
        'Já existe um paciente cadastrado com esses dados',
        400,
      )
    }
  }
}

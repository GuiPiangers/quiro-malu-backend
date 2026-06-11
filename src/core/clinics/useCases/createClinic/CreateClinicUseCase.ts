import { Clinic, ClinicDTO } from '../../models/Clinic'
import { IClinicRepository } from '../../../../repositories/clinic/IClinicRepository'
import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import { ApiError } from '../../../../utils/ApiError'

export interface CreateClinicInputDTO {
  name: string
  owner: {
    name: string
    email: string
    phone: string
    password: string
  }
}

export class CreateClinicUseCase {
  constructor(
    private clinicRepository: IClinicRepository,
    private rbacRepository: IRbacRepository,
    private userRepository: IUserRepository,
    private clinicianRepository: IClinicianRepository,
  ) {}

  async execute(data: CreateClinicInputDTO): Promise<ClinicDTO> {
    const clinicAlreadyExists = await this.clinicRepository.findByName(
      data.name,
    )
    if (clinicAlreadyExists) {
      throw new ApiError('Clínica já cadastrada', 400, 'clinic')
    }

    const [userAlreadyExists] = await this.userRepository.getByEmail(
      data.owner.email,
    )
    if (userAlreadyExists) {
      throw new ApiError('Usuário já cadastrado', 400, 'email')
    }

    const clinic = new Clinic({ name: data.name })
    await this.clinicRepository.save(clinic)

    const roleId = await this.rbacRepository.createClinicAdminRole(clinic.id)

    const owner = clinic.createOwner({
      name: data.owner.name,
      email: data.owner.email,
      phone: data.owner.phone,
      password: data.owner.password,
      roleId,
    })

    await this.clinicianRepository.save(owner)

    return clinic.getDTO()
  }
}

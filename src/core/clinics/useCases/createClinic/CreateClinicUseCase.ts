import { Clinic, ClinicDTO } from '../../models/Clinic'
import { IClinicRepository } from '../../../../repositories/clinic/IClinicRepository'
import type { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'
import { Role } from '../../../rbac/models/Role'
import type { IAppEventListener } from '../../../shared/observers/EventListener'

export interface CreateClinicInputDTO {
  name: string
  owner: {
    name: string
    email: string
    phone: string
  }
}

export class CreateClinicUseCase {
  constructor(
    private clinicRepository: IClinicRepository,
    private rbacRepository: IRbacRepository,
    private userRepository: IUserRepository,
    private clinicianRepository: IClinicianRepository,
    private appEventListener: IAppEventListener,
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

    const permissions = await this.rbacRepository.findAllPermissionsCatalog()

    const clinic = new Clinic({ name: data.name })
    const adminRole = Role.createClinicAdmin({
      clinicId: clinic.id,
      permissions: permissions.map((permission) => permission.key),
    })
    const owner = clinic.createOwner({
      name: data.owner.name,
      email: data.owner.email,
      phone: data.owner.phone,
      roleId: adminRole.id,
    })

    await this.clinicRepository.save(clinic)
    await this.rbacRepository.createRole(adminRole)
    const ownerDTO = await owner.getUserDTO()
    await this.userRepository.save(ownerDTO)
    await this.clinicianRepository.setAsClinician(ownerDTO.id!)

    this.appEventListener.emit('user:pending_user_created', {
      id: ownerDTO.id!,
      email: ownerDTO.email,
      name: ownerDTO.name,
    })

    this.appEventListener.emit('clinic:created', {
      id: clinic.id,
      name: clinic.name,
    })

    return clinic.getDTO()
  }
}

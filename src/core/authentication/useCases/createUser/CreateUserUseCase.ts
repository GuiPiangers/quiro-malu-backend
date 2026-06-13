import { User, UserDTO } from '../../models/User'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'
import { IClinicRepository } from '../../../../repositories/clinic/IClinicRepository'
import type { IRbacRepository } from '../../../../repositories/rbac/IRbacRepository'

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private clinicRepository: IClinicRepository,
    private rbacRepository: IRbacRepository,
  ) {}

  async execute(data: UserDTO) {
    const clinic = await this.clinicRepository.findById(data.clinicId)
    if (!clinic) throw new ApiError('Clínica não encontrada', 404, 'clinicId')

    if (!data.roleId?.trim()) {
      throw new ApiError('roleId é obrigatório', 400, 'roleId')
    }

    const role = await this.rbacRepository.findRoleByIdForClinic({
      id: data.roleId,
      clinicId: data.clinicId,
    })
    if (!role) {
      throw new ApiError('Papel inválido', 400, 'roleId')
    }

    const [userAlreadyExist] = await this.userRepository.getByEmail(data.email)
    if (userAlreadyExist) throw new ApiError('Usuário já cadastrado')

    // Senha não é obrigatória na criação — usuário começa com status 'pending'
    const user = new User({ ...data, password: null, status: 'pending' })
    const userDTO = await user.getUserDTO()

    await this.userRepository.save(userDTO)
    return userDTO
  }
}

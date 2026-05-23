import { UserDTO } from '../../models/User'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'

export class GetUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(params: {
    userId: string
    clinicId: string
  }): Promise<UserDTO> {
    const [user] = await this.userRepository.getById({
      userId: params.userId,
      clinicId: params.clinicId,
    })
    if (!user) {
      throw new ApiError('Usuário não encontrado', 404, 'user')
    }
    return user
  }
}

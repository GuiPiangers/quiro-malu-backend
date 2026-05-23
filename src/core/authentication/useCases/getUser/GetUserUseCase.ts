import type { UserDetailDTO } from '../../userDetailDto'
import {
  toClinicianUserDetail,
  toStandardUserDetail,
} from '../../userDetailDto'
import type { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import type { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'

export class GetUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly clinicianRepository: IClinicianRepository,
  ) {}

  async execute(params: {
    id: string;
    clinicId: string;
  }): Promise<UserDetailDTO> {
    const [user] = await this.userRepository.getById({
      userId: params.id,
      clinicId: params.clinicId,
    })
    if (!user) {
      throw new ApiError('Usuário não encontrado', 404, 'user')
    }

    const clinician = await this.clinicianRepository.findById({
      id: params.id,
      clinicId: params.clinicId,
    })

    if (clinician) {
      return toClinicianUserDetail(clinician)
    }

    return toStandardUserDetail(user)
  }
}

import { IClinicianRepository } from '../../../../repositories/clinician/IClinicianRepository'
import { IUserRepository } from '../../../../repositories/user/IUserRepository'
import { ApiError } from '../../../../utils/ApiError'

export type SetUserAsClinicianInputDTO = {
  userId: string
}

export class SetUserAsClinicianUseCase {
  constructor(
    private readonly clinicianRepository: IClinicianRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    data: SetUserAsClinicianInputDTO,
    clinicId: string,
  ): Promise<void> {
    const [user] = await this.userRepository.getById({
      userId: data.userId,
      clinicId,
    })

    if (!user) {
      throw new ApiError('Usuário não encontrado nesta clínica', 404, 'userId')
    }

    const [existingClinicianId] =
      await this.clinicianRepository.findClinicianIdsInClinic({
        clinicId,
        userIds: [data.userId],
      })

    if (existingClinicianId) {
      throw new ApiError('Usuário já é um profissional clínico')
    }

    await this.clinicianRepository.setAsClinician(data.userId)
  }
}

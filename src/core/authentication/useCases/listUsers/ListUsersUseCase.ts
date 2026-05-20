import type {
  ClinicUserListItem,
  IUserRepository,
} from "../../../../repositories/user/IUserRepository";

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(clinicId: string): Promise<ClinicUserListItem[]> {
    return this.userRepository.listByClinicId({ clinicId });
  }
}

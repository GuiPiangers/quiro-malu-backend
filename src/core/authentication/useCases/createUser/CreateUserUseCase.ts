import { User, UserDTO } from "../../models/User";
import { IUserRepository } from "../../../../repositories/user/IUserRepository";
import { ApiError } from "../../../../utils/ApiError";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(data: UserDTO) {
    const [userAlreadyExist] = await this.userRepository.getByEmail(data.email)
    if (userAlreadyExist) throw new ApiError("Usuário já cadastrado")

    const user = new User(data)
    const userDTO = await user.getUserDTO()

    this.userRepository.save(userDTO);
    return userDTO
  }
}

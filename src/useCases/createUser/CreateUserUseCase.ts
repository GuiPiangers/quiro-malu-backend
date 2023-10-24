import { User, UserDTO } from "../../models/entities/User";
import { IUserRepository } from "../../repositories/user/IUserRepository";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(data: UserDTO) {
    const [userAlreadyExist] = await this.userRepository.getByEmail(data.email)
    if (userAlreadyExist) throw new Error("Já existe um usuário cadastrado com esse email")

    const user = new User(data)
    const { id, name, email, password, phone } = user
    const hash = await password.getHash()

    this.userRepository.create({
      id: id.value,
      name: name.value,
      phone: phone.value,
      email: email.value,
      password: hash
    });
  }
}

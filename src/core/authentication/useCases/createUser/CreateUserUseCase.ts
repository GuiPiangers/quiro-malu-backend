import { User, UserDTO } from "../../models/User";
import { IUserRepository } from "../../../../repositories/user/IUserRepository";
import { ApiError } from "../../../../utils/ApiError";
import { IClinicRepository } from "../../../../repositories/clinic/IClinicRepository";

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private clinicRepository: IClinicRepository,
  ) {}

  async execute(data: UserDTO) {
    const clinic = await this.clinicRepository.findById(data.clinicId);
    if (!clinic) throw new ApiError("Clínica não encontrada", 404, "clinicId");

    const [userAlreadyExist] = await this.userRepository.getByEmail(data.email);
    if (userAlreadyExist) throw new ApiError("Usuário já cadastrado");

    const user = new User(data);
    const userDTO = await user.getUserDTO();

    await this.userRepository.save(userDTO);
    return userDTO;
  }
}

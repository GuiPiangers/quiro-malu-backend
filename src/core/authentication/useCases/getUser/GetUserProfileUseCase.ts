import { IUserRepository } from "../../../../repositories/user/IUserRepository";
import { ApiError } from "../../../../utils/ApiError";

export class GetUserProfileUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(id: string) {
        const [user] = await this.userRepository.getById(id)
        if (!user) throw new ApiError('Não foi possível encontrar o usuário', 400)
        return user
    }
}
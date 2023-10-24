import { IUserRepository } from "../../repositories/user/IUserRepository";

export class GetUserProfileUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(id: string) {
        const [user] = await this.userRepository.getById(id)

        if (!user) {
            throw new Error('Não autorizado')
        }

        return user
    }
}
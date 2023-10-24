import dayjs from "dayjs";
import { RefreshToken } from "../../models/entities/RefreshToken";
import { IRefreshTokenProvider } from "../../provider/refreshToken/IRefreshTokenProvider";
import { IGenerateTokenProvider } from "../../provider/token/IGenerateTokenProvider";
import { IUserRepository } from "../../repositories/user/IUserRepository";
import bcrypt from 'bcrypt'

export class LoginUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private refreshTokenProvider: IRefreshTokenProvider,
        private generateTokenProvider: IGenerateTokenProvider
    ) { }

    async execute(email: string, password: string) {
        const [user] = await this.userRepository.getByEmail(email)
        if (!user) throw new Error("Email ou senha inválidos")

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) throw new Error('Email ou senha inválidos')

        const token = await this.generateTokenProvider.execute(user.id)
        const expiresIn = dayjs().add(15, "days").unix()
        const refreshToken = new RefreshToken({ userId: user.id, expiresIn })

        await this.refreshTokenProvider.generate({
            expiresIn: refreshToken.expiresIn,
            userId: refreshToken.userId,
            id: refreshToken.id.value
        })

        return { token, refreshToken }
    }

}
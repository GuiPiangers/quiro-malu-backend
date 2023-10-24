import { consult } from "../../database/mySqlConnection"
import { RefreshToken, RefreshTokenDTO } from "../../models/entities/RefreshToken";
import { IRefreshTokenProvider } from "./IRefreshTokenProvider";


class RefreshTokenProvider implements IRefreshTokenProvider {

    private async delete(userId: string) {
        const sql = 'DELETE FROM refresh_token WHERE userId = ?'
        const errorMessage = 'Não foi possível deletar os Refresh Tokens'
        await consult(errorMessage, sql, userId)
    }

    async generate(RefreshToken: RefreshTokenDTO): Promise<void> {

        await this.delete(RefreshToken.userId)
        const sql = 'INSERT INTO refresh_token SET ?'
        const errorMessage = 'Não foi possível gerar o Refresh Token'
        await consult(errorMessage, sql, RefreshToken)

    }

    async getRefreshToken(id: string): Promise<RefreshTokenDTO[]> {

        const sql = 'SELECT * FROM refresh_token WHERE id = ?'
        const errorMessage = 'Não foi possível encontrar o Refresh Token'
        const refreshToken = await consult<RefreshTokenDTO[]>(errorMessage, sql, id)

        return refreshToken
    }
}

const refreshTokenProvider = new RefreshTokenProvider()

export { refreshTokenProvider }
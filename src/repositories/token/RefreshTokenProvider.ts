import { query } from "../../server/mySqlConnection";
import { RefreshTokenDTO } from "../../core/authentication/models/RefreshToken";
import { IRefreshTokenProvider } from "./IRefreshTokenProvider";


class RefreshTokenProvider implements IRefreshTokenProvider {

    private async deleteWithUserId(userId: string) {
        const sql = 'DELETE FROM refresh_token WHERE userId = ?'
        const errorMessage = 'Não foi possível deletar os Refresh Tokens'
        await query(errorMessage, sql, userId)
    }
    async delete(userId: string) {
        const sql = 'DELETE FROM refresh_token WHERE id = ?'
        const errorMessage = 'Não foi possível deletar os Refresh Tokens'
        await query(errorMessage, sql, userId)
    }

    async generate(RefreshToken: RefreshTokenDTO): Promise<void> {
        await this.deleteWithUserId(RefreshToken.userId)
        const sql = 'INSERT INTO refresh_token SET ?'
        const errorMessage = 'Não foi possível gerar o Refresh Token'
        await query(errorMessage, sql, RefreshToken)
    }

    async getRefreshToken(id: string): Promise<RefreshTokenDTO[]> {

        const sql = 'SELECT * FROM refresh_token WHERE id = ?'
        const errorMessage = 'Não foi possível encontrar o Refresh Token'
        const refreshToken = await query<RefreshTokenDTO[]>(errorMessage, sql, id)

        return refreshToken
    }

}

const refreshTokenProvider = new RefreshTokenProvider()

export { refreshTokenProvider }
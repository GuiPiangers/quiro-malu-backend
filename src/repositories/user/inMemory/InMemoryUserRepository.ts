import { UserDTO } from "../../../models/entities/User";
import { IUserRepository } from "../IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
    private dbUsers: UserDTO[] = []

    async save(user: UserDTO): Promise<void> {
        this.dbUsers.push(user)
    }
    async getByEmail(email: string): Promise<UserDTO[]> {
        const selectedUser = await this.dbUsers.find(user => user.email === email)

        if (selectedUser) return [selectedUser]
        else return []
    }
    async getById(id: string): Promise<UserDTO[]> {
        const selectedUser = await this.dbUsers.find(user => user.id === id)

        if (selectedUser) return [selectedUser]
        else return []
    }

}
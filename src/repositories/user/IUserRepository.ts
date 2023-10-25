import { UserDTO } from "../../core/authentication/models/User";

export interface IUserRepository {
  save(user: UserDTO): Promise<void>;
  getByEmail(email: string): Promise<UserDTO[]>;
  getById(id: string): Promise<UserDTO[]>;
}

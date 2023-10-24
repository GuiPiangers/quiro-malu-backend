import { UserDTO } from "../../models/entities/User";

export interface IUserRepository {
  create(user: UserDTO): Promise<void>;
  getByEmail(email: string): Promise<UserDTO[]>;
  getById(id: string): Promise<UserDTO[]>;
}

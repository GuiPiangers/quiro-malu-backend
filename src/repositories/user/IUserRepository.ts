import { UserDTO } from "../../core/authentication/models/User";

export type ClinicUserListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clinicId: string;
  roleId: string | null;
};

export interface IUserRepository {
  save(user: UserDTO): Promise<void>;
  getByEmail(email: string): Promise<UserDTO[]>;
  getById(id: string): Promise<UserDTO[]>;
  listByClinicId(params: { clinicId: string }): Promise<ClinicUserListItem[]>;
  /** Retorna quantidade de linhas removidas (0 ou 1). */
  deleteByIdForClinic(params: { id: string; clinicId: string }): Promise<number>;
}

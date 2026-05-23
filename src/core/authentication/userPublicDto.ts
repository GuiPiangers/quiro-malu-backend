import type { UserDTO } from './models/User'
import type { ClinicUserListItem } from '../../repositories/user/IUserRepository'

export function toUserPublicDTO(user: UserDTO): ClinicUserListItem {
  return {
    id: user.id!,
    name: user.name,
    email: user.email,
    phone: user.phone,
    clinicId: user.clinicId,
    roleId: user.roleId ?? null,
  }
}

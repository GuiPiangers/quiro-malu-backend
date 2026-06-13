import { Email } from '../../shared/Email'
import { Entity } from '../../shared/Entity'
import { Name } from '../../shared/Name'
import { Password } from '../../shared/Password'
import { Phone } from '../../shared/Phone'
import { ApiError } from '../../../utils/ApiError'

export type UserStatus = 'pending' | 'active' | 'inactive'

export interface UserDTO {
  id?: string
  name: string
  email: string
  phone: string
  password?: string | null
  clinicId: string
  roleId?: string
  status?: UserStatus
}

export class User extends Entity {
  readonly name: Name
  readonly password: Password | null
  readonly clinicId: string
  readonly roleId?: string
  readonly status: UserStatus
  private _email: Email
  private _phone: Phone

  constructor(props: UserDTO) {
    super(props.id)
    this.name = new Name(props.name, { compoundName: true })
    this._email = new Email(props.email)
    this._phone = new Phone(props.phone)
    this.password = props.password
      ? new Password(props.password)
      : null
    this.clinicId = props.clinicId
    this.roleId = props.roleId
    this.status = props.status ?? 'pending'
  }

  get email() {
    return this._email.value
  }

  get phone() {
    return this._phone.value
  }

  changePassword(newPassword: string): User {
    if (this.status === 'inactive') {
      throw new ApiError(
        'Conta desativada. Entre em contato com o suporte.',
        403,
        'status',
      )
    }

    return new User({
      id: this.id,
      email: this.email,
      password: newPassword,
      name: this.name.value,
      phone: this.phone,
      clinicId: this.clinicId,
      roleId: this.roleId,
      status: 'active',
    })
  }

  async getUserDTO(): Promise<UserDTO> {
    return {
      id: this.id,
      email: this.email,
      password: this.password
        ? await this.password.getHash()
        : null,
      name: this.name.value,
      phone: this.phone,
      clinicId: this.clinicId,
      roleId: this.roleId,
      status: this.status,
    }
  }
}

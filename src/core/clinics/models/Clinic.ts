import { Entity } from '../../shared/Entity'
import { User } from '../../authentication/models/User'

export interface ClinicDTO {
  id?: string
  name: string
}

export class Clinic extends Entity {
  readonly name: string

  constructor({ id, name }: ClinicDTO) {
    super(id)
    this.name = name
  }

  createOwner(ownerProps: {
    name: string
    email: string
    phone: string
    password: string
    roleId: string
  }): User {
    return new User({
      ...ownerProps,
      clinicId: this.id,
      status: 'active',
    })
  }

  getDTO(): ClinicDTO {
    return {
      id: this.id,
      name: this.name,
    }
  }
}

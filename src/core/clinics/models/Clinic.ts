import { Entity } from '../../shared/Entity'
import { Clinician } from '../../clinician/models/Clinician'

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
  }): Clinician {
    return new Clinician({
      ...ownerProps,
      clinicId: this.id,
      services: [],
    })
  }

  getDTO(): ClinicDTO {
    return {
      id: this.id,
      name: this.name,
    }
  }
}

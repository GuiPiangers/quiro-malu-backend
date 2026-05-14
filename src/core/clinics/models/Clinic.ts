import { Entity } from "../../shared/Entity";

export interface ClinicDTO {
  id?: string;
  name: string;
}

export class Clinic extends Entity {
  readonly name: string;

  constructor({ id, name }: ClinicDTO) {
    super(id);
    this.name = name;
  }

  getDTO(): ClinicDTO {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

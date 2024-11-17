import { Cpf } from "../../shared/Cpf";
import { Entity } from "../../shared/Entity";
import { Name } from "../../shared/Name";
import { Phone } from "../../shared/Phone";
import { Location, LocationDTO } from "../../shared/Location";
import { DateTime } from "../../shared/Date";

export interface PatientDTO {
  id?: string;
  name: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "masculino" | "feminino";
  cpf?: string;
  location?: LocationDTO;
}

export class Patient extends Entity {
  readonly name: Name;
  readonly dateOfBirth?: DateTime;
  readonly gender?: "masculino" | "feminino";
  private _phone: Phone;
  private _cpf?: Cpf;
  private _location?: Location;

  constructor(props: PatientDTO) {
    const { id, phone, name, cpf, location, dateOfBirth, gender } = props;

    super(id || `${Date.now()}`);
    this.name = new Name(name, { compoundName: true });
    this._phone = new Phone(phone);
    this._location = location ? new Location(location) : undefined;
    this._cpf = cpf ? new Cpf(cpf) : undefined;
    this.dateOfBirth = dateOfBirth
      ? new DateTime(dateOfBirth, { onlyPassDate: true })
      : undefined;
    this.gender = gender;
  }

  get phone() {
    return this._phone.value;
  }

  get cpf() {
    return this._cpf?.value;
  }

  get location() {
    return this._location;
  }

  getPatientDTO(): PatientDTO {
    const location = this.location?.getLocationDTO();
    console.log(this.dateOfBirth?.date);
    return {
      id: this.id,
      name: this.name.value,
      cpf: this.cpf,
      location,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth?.date,
      gender: this.gender,
    };
  }
}

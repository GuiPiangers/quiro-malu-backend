import { Cpf } from "../../shared/Cpf";
import { Entity } from "../../shared/Entity";
import { Name } from "../../shared/Name";
import { Phone } from "../../shared/Phone";
import { Location, LocationDTO } from "../../shared/Location";
import { DateTime } from "../../shared/Date";
import { Crypto } from "../../shared/helpers/Crypto";
import { ApiError } from "../../../utils/ApiError";

export interface PatientDTO {
  id?: string;
  name: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "masculino" | "feminino";
  cpf?: string;
  location?: LocationDTO;
  hashData?: string;
}

export class Patient extends Entity {
  readonly name: Name;
  readonly dateOfBirth?: DateTime;
  readonly gender?: "masculino" | "feminino";
  private _phone: Phone;
  private _cpf?: Cpf;
  private _location?: Location;
  readonly hashData: string;

  constructor(props: PatientDTO) {
    const { id, phone, name, cpf, location, dateOfBirth, gender, hashData } =
      props;
    super(id);
    if (gender && gender !== "masculino" && gender !== "feminino")
      throw new ApiError('O gênero deve ser "masculino" ou "feminino"', 400);

    this.name = new Name(name, { compoundName: true });
    this._phone = new Phone(phone);
    this._location = location ? new Location(location) : undefined;
    this._cpf = cpf ? new Cpf(cpf) : undefined;
    this.dateOfBirth = dateOfBirth
      ? new DateTime(dateOfBirth, { onlyPassDate: true })
      : undefined;
    this.gender = gender;
    this.hashData =
      hashData ??
      Crypto.createFixedHash(
        JSON.stringify({
          name: this.name.value.replace(" ", "").toLocaleLowerCase(),
          phone: this.phone.replace(" ", ""),
          dateOfBirth: this.dateOfBirth?.value,
        }),
      );
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

  getPatientDTO() {
    const location = this.location?.getLocationDTO();
    return {
      id: this.id,
      name: this.name.value,
      cpf: this.cpf,
      location,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth?.date,
      gender: this.gender,
      hashData: this.hashData,
    };
  }
}

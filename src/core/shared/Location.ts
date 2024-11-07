import { Cep } from "../shared/Cep";
import { Name } from "../shared/Name";

export interface LocationDTO {
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
}

export class Location {
  private _cep?: Cep;
  private _state?: Name;
  private _city?: Name;
  private _neighborhood?: Name;
  private _address?: Name;

  constructor(props: LocationDTO) {
    const { cep, state, city, address, neighborhood } = props;

    this._state = state ? new Name(state) : undefined;
    this._cep = cep ? new Cep(cep) : undefined;
    this._city = city ? new Name(city) : undefined;
    this._address = address ? new Name(address) : undefined;
    this._neighborhood = neighborhood ? new Name(neighborhood) : undefined;
  }

  get state() {
    return this._state?.value;
  }

  get cep() {
    return this._cep?.value;
  }

  get address() {
    return this._address?.value;
  }

  get neighborhood() {
    return this._neighborhood?.value;
  }

  get city() {
    return this._city?.value;
  }

  getLocationDTO(): LocationDTO {
    return {
      cep: this.cep,
      state: this.state,
      address: this.address,
      neighborhood: this.neighborhood,
      city: this.city,
    };
  }
}

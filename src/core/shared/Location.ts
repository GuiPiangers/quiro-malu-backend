import { Cep } from "../shared/Cep"
import { Name } from "../shared/Name"

export interface LocationDTO {
    cep?: string | null
    state?: string | null
    city?: string | null
    neighborhood?: string | null
    address?: string | null
}

export class Location {
    private _cep: Cep | null
    private _state: Name | null
    private _city: Name | null
    private _neighborhood: Name | null
    private _address: Name | null

    constructor(props: LocationDTO) {
        const { cep, state, city, address, neighborhood } = props

        this._state = state ? new Name(state) : null
        this._cep = cep ? new Cep(cep) : null
        this._city = city ? new Name(city) : null
        this._address = address ? new Name(address) : null
        this._neighborhood = neighborhood ? new Name(neighborhood) : null
    }

    get state() { return this._state?.value || null }
    get cep() { return this._cep?.value || null }
    get address() { return this._address?.value || null }
    get neighborhood() { return this._neighborhood?.value || null }
    get city() { return this._city?.value || null }

    getLocationDTO(): LocationDTO {
        return {
            cep: this.cep,
            state: this.state,
            address: this.address,
            neighborhood: this.neighborhood,
            city: this.city
        }
    }
}
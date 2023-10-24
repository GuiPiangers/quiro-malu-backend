import { Cep } from "../shared/Cep"
import { Entity } from "../shared/Entity"

export interface AddressDTO {
    id?: string
    cep?: string
    state?: string
    city?: string
    neighborhood?: string
    address?: string
}

export class Address extends Entity {
    readonly cep: Cep
    constructor(props: AddressDTO) {
        const { id, cep, ...rest } = props
        super(id)
        if (props.cep) this.cep = new Cep(cep)
        Object.assign(this, rest)
    }
}
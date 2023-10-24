import { IAdressProvider } from "../../provider/address/IAddressProvider"

export interface StateDTO {
    name: string
    acronym?: string
}

export class State {
    name: string
    acronym?: string
    constructor(
        props: StateDTO,
        private addressProvider: IAdressProvider
    ) {
        this.name = props.name
        this.acronym = props.acronym
    }

    async validateState(state: string) {
        const states = await this.addressProvider.getStates()
        const isValid = states.some(value => value.name === state)
        return isValid
    }
}
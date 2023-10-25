import { Name } from "./Name"

export interface StateDTO {
    name: string
    acronym?: string
}

export class State {
    private _name: Name
    acronym?: string
    constructor(
        props: StateDTO,
    ) {
        this._name = new Name(props.name)
        if (props.acronym && props.acronym?.length !== 2) throw new Error('O acrônimo deve conter apenas 2 caracteres')
        this.acronym = props.acronym?.toUpperCase()
    }

    get name() { return this._name.value }

    getStateDTO(): StateDTO {
        return {
            name: this.name,
            acronym: this.acronym
        }
    }

}
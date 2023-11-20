import { Entity } from "../../shared/Entity";

export interface ServiceDTO {
    id?: string
    name: string
    value: number
    duration: number
}

export class Service extends Entity {
    readonly name: string
    readonly value: number
    readonly duration: number

    constructor({ id, duration, value, name }: ServiceDTO) {
        super(id)
        this.name = name
        this.duration = duration
        this.value = value
    }

    getDTO() {
        return {
            id: this.id,
            name: this.name,
            duration: this.duration,
            value: this.value
        }
    }
}
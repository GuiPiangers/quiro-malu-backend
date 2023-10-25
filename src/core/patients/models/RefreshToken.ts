import { Entity } from "../../shared/Entity";

export interface RefreshTokenDTO {
    id?: string
    userId: string
    expiresIn: number
}

export class RefreshToken extends Entity {
    readonly userId: string
    readonly expiresIn: number

    constructor(props: RefreshTokenDTO) {
        super(props.id)
        this.userId = props.userId
        this.expiresIn = props.expiresIn
    }
}
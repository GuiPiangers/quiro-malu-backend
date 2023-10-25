import { Entity } from "../../shared/Entity";

export interface PatientDTO {
    id?: string
    name: string
    phone: string
    dateOfBirth?: string
    gender?: "masculino" | "feminino"
    cpf?: string
}

export class Patient extends Entity {
    constructor(props: PatientDTO) {
        super(props.id)
    }
}
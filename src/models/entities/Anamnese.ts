import { Entity } from "../shared/Entity";

export interface AnamneseDTO {
    id?: string
    mainComplaint: string
    currentIllness: string
    problemHistory: string
    familiarHistory: string
    activities: string
    isSmoke: 'yes' | 'no' | 'passive'
    useMedicine: boolean
    whichMedicine: string
    underwentSurgery: boolean
    whichSurgery: string
}

export class Anamnese extends Entity {
    constructor(props: AnamneseDTO) {
        super(props.id)
    }
}
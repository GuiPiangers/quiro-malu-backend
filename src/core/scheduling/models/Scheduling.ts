import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export interface SchedulingDTO {
    id?: string
    patientId: string
    date: string
    duration: number
    createAt?: string
    updateAt?: string
    service?: string | null
}

export class Scheduling extends Entity {
    readonly patientId: string
    readonly date: DateTime
    readonly duration: number
    readonly createAt?: string
    readonly updateAt?: string
    readonly service?: string | null

    constructor({ id, date, duration, patientId, createAt, service, updateAt }: SchedulingDTO) {
        super(id)
        this.patientId = patientId
        this.date = new DateTime(date, { onlyFutureDate: true })
        this.service = service || null
        this.duration = duration
        this.createAt = createAt
        this.updateAt = updateAt
    }

    getDTO(): SchedulingDTO {
        return {
            id: this.id,
            patientId: this.patientId,
            date: this.date.value,
            duration: this.duration,
            createAt: this.createAt,
            updateAt: this.updateAt,
            service: this.service,
        }
    }
}
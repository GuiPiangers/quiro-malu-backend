import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export interface SchedulingDTO {
    id?: string
    patientId: string
    date: string
    duration: number
    service?: string | null
    status?: string | null
    createAt?: string
    updateAt?: string
}

export class Scheduling extends Entity {
    readonly patientId: string
    readonly date: DateTime
    readonly duration: number
    readonly status: string | null
    readonly service?: string | null
    readonly createAt?: string
    readonly updateAt?: string

    constructor({ id, date, duration, status, patientId, createAt, service, updateAt }: SchedulingDTO) {
        super(id)
        this.patientId = patientId
        this.date = new DateTime(date, { onlyFutureDate: true })
        this.service = service || null
        this.duration = duration
        this.status = status || null
        this.createAt = createAt
        this.updateAt = updateAt
    }

    getDTO(): SchedulingDTO {
        return {
            id: this.id,
            patientId: this.patientId,
            date: this.date.value,
            duration: this.duration,
            status: this.status,
            createAt: this.createAt,
            updateAt: this.updateAt,
            service: this.service,
        }
    }
}
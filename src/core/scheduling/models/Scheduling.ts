import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export type SchedulingStatus = "Agendado" | "Atendido";

export interface SchedulingDTO {
  id?: string;
  patientId: string;
  date: string;
  duration: number;
  service?: string | null;
  status?: SchedulingStatus | null;
  createAt?: string;
  updateAt?: string;
}

export class Scheduling extends Entity {
  readonly patientId: string;
  readonly date: DateTime;
  readonly duration: number;
  readonly status: SchedulingStatus | null;
  readonly service?: string | null;
  readonly createAt?: string;
  readonly updateAt?: string;

  constructor({
    id,
    date,
    duration,
    status,
    patientId,
    createAt,
    service,
    updateAt,
  }: SchedulingDTO) {
    super(id || `${Date.now()}`);
    this.patientId = patientId;
    this.date = new DateTime(date);
    this.service = service || null;
    this.duration = duration;
    this.status = status || null;
    this.createAt = createAt;
    this.updateAt = updateAt;
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
    };
  }

  isAvailableDate(data: SchedulingDTO[]): boolean {
    return data.some((schedulingValue) => {
      const date = new Date(schedulingValue.date);
      date.setSeconds(this.duration);

      const schedulingDate = new Date(this.date.value);
      schedulingDate.setSeconds(this.duration);

      const schedulingStart = this.date.value;
      const schedulingEnd = new DateTime(schedulingDate.toISOString()).value;

      const start = new DateTime(schedulingValue.date).value;
      const end = new DateTime(date.toISOString()).value;

      const unavailableStartDate =
        start <= schedulingStart && schedulingStart < end;
      const unavailableEndDate = start < schedulingEnd && schedulingEnd < end;

      return unavailableEndDate || unavailableStartDate;
    });
  }
}

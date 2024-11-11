import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import ClientStatusStrategy from "./status/ClientStatusStrategy";
import { StatusStrategy } from "./status/StatusStrategy";

export type SchedulingStatus = "Agendado" | "Atendido" | "Atrasado";

export interface SchedulingDTO {
  id?: string;
  patientId: string;
  patient?: string;
  phone?: string;
  date: string;
  duration: number;
  service?: string;
  status?: "Agendado" | "Atendido" | "Atrasado";
  createAt?: string;
  updateAt?: string;
}

export class Scheduling extends Entity {
  readonly patientId: string;
  readonly patient?: string;
  readonly phone?: string;
  readonly date: DateTime;
  readonly duration: number;
  readonly service?: string;
  readonly createAt?: string;
  readonly updateAt?: string;
  private _status?: SchedulingStatus | "Atrasado";
  private satusStategy?: StatusStrategy;

  constructor(
    {
      id,
      date,
      duration,
      status,
      patientId,
      createAt,
      service,
      updateAt,
      patient,
      phone,
    }: SchedulingDTO,
    satusStategy?: StatusStrategy,
  ) {
    super(id || `${Date.now()}`);
    this.satusStategy = satusStategy || new ClientStatusStrategy();
    this.patientId = patientId;
    this.date = new DateTime(date);
    this.service = service;
    this.duration = duration;
    this._status = status;

    this.createAt = createAt;
    this.updateAt = updateAt;
    this.patient = patient;
    this.phone = phone;
  }

  get status() {
    return this.satusStategy?.calculateStatus({
      scheduling: this,
      status: this._status,
    });
  }

  getDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      date: this.date.value,
      duration: this.duration,
      status: this.status,
      // createAt: this.createAt,
      // updateAt: this.updateAt,
      service: this.service,
      patient: this.patient,
      phone: this.phone,
    };
  }

  notAvailableDate(data: SchedulingDTO[]): boolean {
    return data.some((schedulingValue) => {
      const endDate = new Date(`${schedulingValue.date}:00.000Z`);
      endDate.setSeconds(this.duration);
      console.log(endDate);

      const schedulingDate = new Date(`${this.date.value}:00.000Z`);
      schedulingDate.setSeconds(this.duration);

      const schedulingStart = this.date.value;
      const schedulingEnd = new DateTime(schedulingDate.toISOString(), {})
        .value;

      const start = new DateTime(schedulingValue.date).value;
      const end = new DateTime(endDate.toISOString()).value;

      console.log(schedulingValue.date);

      const unavailableStartDate =
        start <= schedulingStart && schedulingStart < end;
      const unavailableEndDate = start < schedulingEnd && schedulingEnd < end;

      return (
        schedulingValue.id !== this.id &&
        (unavailableEndDate || unavailableStartDate)
      );
    });
  }
}

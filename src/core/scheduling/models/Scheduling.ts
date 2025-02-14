import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import ClientStatusStrategy from "./status/ClientStatusStrategy";
import { StatusStrategy } from "./status/StatusStrategy";

export type SchedulingStatus =
  | "Agendado"
  | "Atendido"
  | "Atrasado"
  | "Cancelado";

export interface SchedulingDTO {
  id?: string;
  patientId: string;
  patient?: string;
  phone?: string;
  date?: string;
  duration?: number;
  service?: string;
  status?: SchedulingStatus;
  createAt?: string;
  updateAt?: string;
}

export class Scheduling extends Entity {
  readonly patientId: string;
  readonly patient?: string;
  readonly phone?: string;
  readonly date?: DateTime;
  readonly duration?: number;
  readonly service?: string;
  readonly createAt?: string;
  readonly updateAt?: string;
  private _status?: SchedulingStatus;
  private statusStrategy?: StatusStrategy;

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
    statusStrategy?: StatusStrategy,
  ) {
    super(id || `${Date.now()}`);
    this.statusStrategy = statusStrategy || new ClientStatusStrategy();
    this.patientId = patientId;
    this.date = date ? new DateTime(date) : undefined;
    this.service = service;
    this.duration = duration;
    this._status = status;

    this.createAt = createAt;
    this.updateAt = updateAt;
    this.patient = patient;
    this.phone = phone;
  }

  get status() {
    return this.statusStrategy?.calculateStatus({
      scheduling: this,
      status: this._status,
    });
  }

  getDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      date: this.date?.dateTime,
      duration: this.duration,
      status: this.status,
      service: this.service,
    };
  }

  notAvailableDate(data: SchedulingDTO[]): boolean {
    if (!this.date?.dateTime) throw new ApiError("A data deve ser definida");
    if (!this.duration) throw new ApiError("A duração deve ser definida");

    return data.some((schedulingValue) => {
      const endDate = new Date(`${schedulingValue.date}:00.000Z`);
      endDate.setSeconds(this.duration!);

      const schedulingDate = new Date(`${this.date!.dateTime}:00.000Z`);
      schedulingDate.setSeconds(this.duration!);

      const schedulingStart = this.date!.dateTime;
      const schedulingEnd = new DateTime(schedulingDate.toISOString(), {})
        .dateTime;

      const start = new DateTime(schedulingValue.date!).dateTime;
      const end = new DateTime(endDate.toISOString()).dateTime;

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

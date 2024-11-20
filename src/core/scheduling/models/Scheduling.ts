import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import { StatusStrategyData } from "./status/StatusStrategy";

export type SchedulingStatus = "Agendado" | "Atendido" | "Atrasado";

export interface SchedulingDTO {
  id?: string;
  patientId: string;
  date?: string;
  duration?: number;
  service?: string;
  status?: "Agendado" | "Atendido" | "Atrasado";
  createAt?: string;
  updateAt?: string;
}

export class Scheduling extends Entity {
  readonly patientId: string;
  readonly date?: DateTime;
  readonly duration?: number;
  readonly service?: string;
  readonly createAt?: string;
  readonly updateAt?: string;
  private status?: SchedulingStatus | "Atrasado";

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
    this.date = date ? new DateTime(date) : undefined;
    this.service = service;
    this.duration = duration;
    this.status = status
      ? this.calculateStatus({ status, scheduling: this })
      : undefined;

    this.createAt = createAt;
    this.updateAt = updateAt;
  }

  protected calculateStatus({ status }: StatusStrategyData): SchedulingStatus {
    if (status === "Atrasado") return "Agendado";
    return status || "Agendado";
  }

  getDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      date: this.date?.value,
      duration: this.duration,
      status: this.status,
      service: this.service,
    };
  }

  notAvailableDate(data: SchedulingDTO[]): boolean {
    if (!this.date?.value) throw new ApiError("A data deve ser definida");
    if (!this.duration) throw new ApiError("A duração deve ser definida");

    return data.some((schedulingValue) => {
      const endDate = new Date(`${schedulingValue.date}:00.000Z`);
      endDate.setSeconds(this.duration!);

      const schedulingDate = new Date(`${this.date!.value}:00.000Z`);
      schedulingDate.setSeconds(this.duration!);

      const schedulingStart = this.date!.value;
      const schedulingEnd = new DateTime(schedulingDate.toISOString(), {})
        .value;

      const start = new DateTime(schedulingValue.date!).value;
      const end = new DateTime(endDate.toISOString()).value;

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

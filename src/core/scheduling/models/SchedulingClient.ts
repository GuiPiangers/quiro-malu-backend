import { TZDate } from "@date-fns/tz";
import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import { Scheduling, SchedulingDTO } from "./Scheduling";
import ClientStatusStrategy from "./status/ClientStatusStrategy";
import { StatusStrategy, StatusStrategyData } from "./status/StatusStrategy";

export type SchedulingStatus = "Agendado" | "Atendido" | "Atrasado";

export class SchedulingClient extends Scheduling {
  readonly patientName: string;
  readonly patientPhone: string;
  constructor({
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
  }: SchedulingDTO & { patient: string; phone: string }) {
    super({
      id,
      date,
      duration,
      status,
      patientId,
      createAt,
      updateAt,
      service,
    });

    this.patientName = patient;
    this.patientPhone = phone;
  }

  protected calculateStatus({ scheduling, status }: StatusStrategyData) {
    if (!scheduling.date?.value)
      throw new ApiError("A data deve ser definida para calcular o status");
    const date = new TZDate(new Date(), "Etc/UTC");
    const schedulingDate = new TZDate(scheduling.date?.value, "Etc/UTC");
    if (schedulingDate < date && status === "Agendado") return "Atrasado";
    return status || "Agendado";
  }
}

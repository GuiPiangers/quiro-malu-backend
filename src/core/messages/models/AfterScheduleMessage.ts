import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import { MessageTemplate, MessageTemplateDTO } from "./MessageTemplate";

export type AfterScheduleMessageDTO = {
  id?: string;
  name: string;
  minutesAfterSchedule: number;
  isActive: boolean;
  messageTemplate: MessageTemplateDTO;
};

export class AfterScheduleMessage extends Entity {
  readonly name: string;
  readonly minutesAfterSchedule: number;
  readonly isActive: boolean;
  readonly messageTemplate: MessageTemplate;

  constructor({
    id,
    name,
    messageTemplate,
    minutesAfterSchedule,
    isActive = true,
  }: {
    id?: string;
    name: string;
    minutesAfterSchedule: number;
    messageTemplate: MessageTemplate;
    isActive?: boolean;
  }) {
    super(id);

    if (typeof name !== "string") {
      throw new ApiError("name deve ser uma string", 400, "name");
    }

    if (!Number.isInteger(minutesAfterSchedule) || minutesAfterSchedule <= 0) {
      throw new ApiError(
        "minutesAfterSchedule deve ser um inteiro maior que zero",
        400,
        "minutesAfterSchedule",
      );
    }

    if (typeof isActive !== "boolean") {
      throw new ApiError("isActive deve ser um booleano", 400, "isActive");
    }

    this.name = name.trim();
    this.minutesAfterSchedule = minutesAfterSchedule;
    this.isActive = isActive;
    this.messageTemplate = messageTemplate;
  }

  render({
    patient,
    scheduling,
  }: {
    patient: { name: string; phone: string; gender?: string };
    scheduling?: { date?: string; service?: string; status?: string };
  }): string {
    return this.messageTemplate.replaceVariables(
      this.buildTemplateVariables({ patient, scheduling }),
    );
  }

  private buildTemplateVariables({
    patient,
    scheduling,
  }: {
    patient: { name: string; phone: string; gender?: string };
    scheduling?: { date?: string; service?: string; status?: string };
  }): Record<string, string> {
    const dateTime =
      scheduling?.date != null ? new DateTime(scheduling.date) : null;

    return {
      nome_paciente: patient.name,
      telefone_paciente: patient.phone,
      genero_paciente: patient.gender ?? "",
      data_consulta: dateTime ? DateTime.toLocaleDate(dateTime.date) : "",
      horario_consulta: dateTime ? dateTime.time : "",
      servico_consulta: scheduling?.service ?? "",
      status_consulta: scheduling?.status ?? "",
    };
  }

  getDTO(): AfterScheduleMessageDTO {
    return {
      id: this.id,
      name: this.name,
      minutesAfterSchedule: this.minutesAfterSchedule,
      isActive: this.isActive,
      messageTemplate: this.messageTemplate.getDTO(),
    };
  }
}

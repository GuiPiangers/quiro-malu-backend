import { ApiError } from "../../../utils/ApiError";
import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";
import { patientFirstNameFromFullName } from "../utils/patientFirstNameFromFullName";
import { MessageTemplate, MessageTemplateDTO } from "./MessageTemplate";

export type BeforeScheduleMessageDTO = {
  id?: string;
  name: string;
  minutesBeforeSchedule: number;
  isActive: boolean;
  messageTemplate: MessageTemplateDTO;
};

export class BeforeScheduleMessage extends Entity {
  readonly name: string;
  readonly minutesBeforeSchedule: number;
  readonly isActive: boolean;
  readonly messageTemplate: MessageTemplate;

  constructor({
    id,
    name,
    messageTemplate,
    minutesBeforeSchedule,
    isActive = true,
  }: {
    id?: string;
    name: string;
    minutesBeforeSchedule: number;
    messageTemplate: MessageTemplate;
    isActive?: boolean;
  }) {
    super(id);

    if (typeof name !== "string") {
      throw new ApiError("name deve ser uma string", 400, "name");
    }

    if (!Number.isInteger(minutesBeforeSchedule) || minutesBeforeSchedule <= 0) {
      throw new ApiError(
        "minutesBeforeSchedule deve ser um inteiro maior que zero",
        400,
        "minutesBeforeSchedule",
      );
    }

    if (typeof isActive !== "boolean") {
      throw new ApiError("isActive deve ser um booleano", 400, "isActive");
    }

    this.name = name.trim();
    this.minutesBeforeSchedule = minutesBeforeSchedule;
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

    const nomeCompleto = `${patient.name}`.trim();

    return {
      nome_paciente: patientFirstNameFromFullName(patient.name),
      nome_completo_paciente: nomeCompleto,
      telefone_paciente: patient.phone,
      genero_paciente: patient.gender ?? "",
      data_consulta: dateTime ? DateTime.toLocaleDate(dateTime.date) : "",
      horario_consulta: dateTime ? dateTime.time : "",
      servico_consulta: scheduling?.service ?? "",
      status_consulta: scheduling?.status ?? "",
    };
  }

  getDTO(): BeforeScheduleMessageDTO {
    return {
      id: this.id,
      name: this.name,
      minutesBeforeSchedule: this.minutesBeforeSchedule,
      isActive: this.isActive,
      messageTemplate: this.messageTemplate.getDTO(),
    };
  }
}

import { DateTime as Luxon } from "luxon";
import { ApiError } from "../../../utils/ApiError";
import { Entity } from "../../shared/Entity";
import { MessageTemplate, MessageTemplateDTO } from "./MessageTemplate";

export type BirthdayMessageDTO = {
  id?: string;
  name: string;
  isActive: boolean;
  messageTemplate: MessageTemplateDTO;
};

export class BirthdayMessage extends Entity {
  readonly name: string;
  readonly isActive: boolean;
  readonly messageTemplate: MessageTemplate;

  constructor({
    id,
    name,
    messageTemplate,
    isActive = true,
  }: {
    id?: string;
    name: string;
    messageTemplate: MessageTemplate;
    isActive?: boolean;
  }) {
    super(id);

    if (typeof name !== "string") {
      throw new ApiError("name deve ser uma string", 400, "name");
    }

    if (typeof isActive !== "boolean") {
      throw new ApiError("isActive deve ser um booleano", 400, "isActive");
    }

    this.name = name.trim();
    this.isActive = isActive;
    this.messageTemplate = messageTemplate;
  }


  render({
    patient,
  }: {
    patient: { name: string; phone: string; birthDate: string };
  }): string {
    return this.messageTemplate.replaceVariables(
      this.buildTemplateVariables(patient),
    );
  }

  private buildTemplateVariables(patient: {
    name: string;
    phone: string;
    birthDate: string;
  }): Record<string, string> {
    return {
      nome_paciente: patient.name,
      telefone_paciente: patient.phone,
      dia_aniversario: BirthdayMessage.formatBirthDateAsDayMonthPt(
        patient.birthDate,
      ),
    };
  }

  private static formatBirthDateAsDayMonthPt(birthDate: string): string {
    const trimmed = birthDate.trim();
    if (!trimmed) return "";

    const iso = trimmed.includes("T") ? trimmed : `${trimmed}T12:00:00`;
    const dt = Luxon.fromISO(iso, {
      zone: "America/Sao_Paulo",
    }).setLocale("pt-BR");

    if (!dt.isValid) return "";

    return dt.toFormat("dd 'de' MMMM");
  }

  getDTO(): BirthdayMessageDTO {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive,
      messageTemplate: this.messageTemplate.getDTO(),
    };
  }
}

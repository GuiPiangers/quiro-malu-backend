import { DateTime as Luxon } from "luxon";
import { ApiError } from "../../../utils/ApiError";
import { Entity } from "../../shared/Entity";
import { MessageTemplate, MessageTemplateDTO } from "./MessageTemplate";

export type BirthdayMessageDTO = {
  id?: string;
  name: string;
  isActive: boolean;
  /** Horário de envio no dia do aniversário (HH:mm, fuso America/Sao_Paulo na fila). */
  sendTime: string;
  messageTemplate: MessageTemplateDTO;
};

export class BirthdayMessage extends Entity {
  readonly name: string;
  readonly isActive: boolean;
  readonly sendTime: string;
  readonly messageTemplate: MessageTemplate;

  constructor({
    id,
    name,
    messageTemplate,
    sendTime,
    isActive = true,
  }: {
    id?: string;
    name: string;
    messageTemplate: MessageTemplate;
    sendTime: string;
    isActive?: boolean;
  }) {
    super(id);

    if (typeof name !== "string") {
      throw new ApiError("name deve ser uma string", 400, "name");
    }

    if (typeof isActive !== "boolean") {
      throw new ApiError("isActive deve ser um booleano", 400, "isActive");
    }

    const st = typeof sendTime === "string" ? sendTime.trim() : "";
    const normalized = BirthdayMessage.normalizeSendTime(st);
    if (!normalized) {
      throw new ApiError(
        "sendTime deve estar no formato HH:mm (00:00 a 23:59)",
        400,
        "sendTime",
      );
    }

    this.name = name.trim();
    this.isActive = isActive;
    this.sendTime = normalized;
    this.messageTemplate = messageTemplate;
  }

  render({
    patient,
  }: {
    patient: {
      name: string;
      phone: string;
      birthDate: string | Date | null | undefined;
    };
  }): string {
    return this.messageTemplate.replaceVariables(
      this.buildTemplateVariables(patient),
    );
  }

  private buildTemplateVariables(patient: {
    name: string;
    phone: string;
    birthDate: string | Date | null | undefined;
  }): Record<string, string> {
    const dia = BirthdayMessage.formatBirthDateAsDayMonthPt(patient.birthDate);
    return {
      nome_paciente: patient.name,
      telefone_paciente: patient.phone,
      dia_aniversario: dia,
      data_aniversario: dia,
    };
  }

  static normalizeSendTime(raw: string): string | null {
    const m = raw.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }

  private static formatBirthDateAsDayMonthPt(
    birthDate: string | Date | null | undefined,
  ): string {
    if (birthDate == null) return "";

    if (birthDate instanceof Date) {
      const dt = Luxon.fromJSDate(birthDate, {
        zone: "America/Sao_Paulo",
      }).setLocale("pt-BR");
      if (!dt.isValid) return "";
      return dt.toFormat("dd 'de' MMMM");
    }

    const trimmed = String(birthDate).trim();
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
      sendTime: this.sendTime,
      messageTemplate: this.messageTemplate.getDTO(),
    };
  }
}

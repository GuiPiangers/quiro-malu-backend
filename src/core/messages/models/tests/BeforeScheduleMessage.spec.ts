import { ApiError } from "../../../../utils/ApiError";
import { BeforeScheduleMessage } from "../BeforeScheduleMessage";
import { MessageTemplate } from "../MessageTemplate";

describe("BeforeScheduleMessage", () => {
  it("should create entity with minutes and message template", () => {
    const messageTemplate = new MessageTemplate({
      id: "template-1",
      textTemplate: "Ola {{nome}}",
    });

    const entity = new BeforeScheduleMessage({
      id: "before-1",
      name: "Lembrete 30min",
      minutesBeforeSchedule: 30,
      messageTemplate,
    });

    expect(entity.id).toBe("before-1");
    expect(entity.name).toBe("Lembrete 30min");
    expect(entity.minutesBeforeSchedule).toBe(30);
    expect(entity.isActive).toBe(true);
    expect(entity.messageTemplate).toBe(messageTemplate);
  });

  it("should accept isActive false", () => {
    const messageTemplate = new MessageTemplate({ textTemplate: "x" });

    const entity = new BeforeScheduleMessage({
      name: "Inativa",
      minutesBeforeSchedule: 10,
      messageTemplate,
      isActive: false,
    });

    expect(entity.isActive).toBe(false);
  });

  it("should throw ApiError when minutesBeforeSchedule is zero or invalid", () => {
    const messageTemplate = new MessageTemplate({ textTemplate: "template" });

    expect(() => {
      new BeforeScheduleMessage({
        name: "x",
        minutesBeforeSchedule: 0,
        messageTemplate,
      });
    }).toThrow(ApiError);

    expect(() => {
      new BeforeScheduleMessage({
        name: "x",
        minutesBeforeSchedule: 2.5,
        messageTemplate,
      });
    }).toThrow(ApiError);
  });

  it("should render message with data_consulta in dd/mm/yyyy and horario_consulta in HH:MM", () => {
    const entity = new BeforeScheduleMessage({
      name: "Consulta",
      minutesBeforeSchedule: 60,
      messageTemplate: new MessageTemplate({
        textTemplate:
          "Olá {{nome_paciente}}, consulta em {{data_consulta}} às {{horario_consulta}}.",
      }),
    });

    const rendered = entity.render({
      patient: { name: "Maria", phone: "51999999999" },
      scheduling: { date: "2025-06-15T14:30", service: "Consulta" },
    });

    expect(rendered).toBe("Olá Maria, consulta em 15/06/2025 às 14:30.");
  });

  it("should render message with empty date fields when scheduling has no date", () => {
    const entity = new BeforeScheduleMessage({
      name: "Sem data",
      minutesBeforeSchedule: 60,
      messageTemplate: new MessageTemplate({
        textTemplate: "{{data_consulta}} {{horario_consulta}}",
      }),
    });

    const rendered = entity.render({
      patient: { name: "João", phone: "51988888888" },
      scheduling: undefined,
    });

    expect(rendered).toBe(" ");
  });

  it("should return DTO including nested messageTemplate", () => {
    const messageTemplate = new MessageTemplate({
      id: "template-2",
      textTemplate: "Lembrete para {{nome}}",
    });

    const entity = new BeforeScheduleMessage({
      id: "before-2",
      name: "DTO test",
      minutesBeforeSchedule: 45,
      messageTemplate,
    });

    expect(entity.getDTO()).toEqual({
      id: "before-2",
      name: "DTO test",
      minutesBeforeSchedule: 45,
      isActive: true,
      messageTemplate: {
        id: "template-2",
        textTemplate: "Lembrete para {{nome}}",
      },
    });
  });
});

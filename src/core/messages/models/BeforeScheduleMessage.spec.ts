import { ApiError } from "../../../utils/ApiError";
import { BeforeScheduleMessage } from "./BeforeScheduleMessage";
import { MessageTemplate } from "./MessageTemplate";

describe("BeforeScheduleMessage", () => {
  it("should create entity with minutes and message template", () => {
    const messageTemplate = new MessageTemplate({
      id: "template-1",
      textTemplate: "Ola {{nome}}",
    });

    const entity = new BeforeScheduleMessage({
      id: "before-1",
      minutesBeforeSchedule: 30,
      messageTemplate,
    });

    expect(entity.id).toBe("before-1");
    expect(entity.minutesBeforeSchedule).toBe(30);
    expect(entity.isActive).toBe(true);
    expect(entity.messageTemplate).toBe(messageTemplate);
  });

  it("should accept isActive false", () => {
    const messageTemplate = new MessageTemplate({ textTemplate: "x" });

    const entity = new BeforeScheduleMessage({
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
        minutesBeforeSchedule: 0,
        messageTemplate,
      });
    }).toThrow(ApiError);

    expect(() => {
      new BeforeScheduleMessage({
        minutesBeforeSchedule: 2.5,
        messageTemplate,
      });
    }).toThrow(ApiError);
  });

  it("should return DTO including nested messageTemplate", () => {
    const messageTemplate = new MessageTemplate({
      id: "template-2",
      textTemplate: "Lembrete para {{nome}}",
    });

    const entity = new BeforeScheduleMessage({
      id: "before-2",
      minutesBeforeSchedule: 45,
      messageTemplate,
    });

    expect(entity.getDTO()).toEqual({
      id: "before-2",
      minutesBeforeSchedule: 45,
      isActive: true,
      messageTemplate: {
        id: "template-2",
        textTemplate: "Lembrete para {{nome}}",
      },
    });
  });
});

import { ApiError } from "../../../../utils/ApiError";
import { BirthdayMessage } from "../BirthdayMessage";
import { MessageTemplate } from "../MessageTemplate";

const defaultSend = "09:00";

describe("BirthdayMessage", () => {
  it("should create entity with message template", () => {
    const messageTemplate = new MessageTemplate({
      id: "template-1",
      textTemplate: "Parabéns {{nome_paciente}}",
    });

    const entity = new BirthdayMessage({
      id: "bd-1",
      name: "Aniversário padrão",
      messageTemplate,
      sendTime: defaultSend,
    });

    expect(entity.id).toBe("bd-1");
    expect(entity.name).toBe("Aniversário padrão");
    expect(entity.sendTime).toBe("09:00");
    expect(entity.isActive).toBe(true);
    expect(entity.messageTemplate).toBe(messageTemplate);
  });

  it("should accept isActive false", () => {
    const messageTemplate = new MessageTemplate({ textTemplate: "x" });

    const entity = new BirthdayMessage({
      name: "Inativa",
      messageTemplate,
      sendTime: "14:30",
      isActive: false,
    });

    expect(entity.isActive).toBe(false);
    expect(entity.sendTime).toBe("14:30");
  });

  it("should render nome_paciente, telefone_paciente e dia_aniversario em pt-BR", () => {
    const entity = new BirthdayMessage({
      name: "Aniversário",
      sendTime: defaultSend,
      messageTemplate: new MessageTemplate({
        textTemplate:
          "Olá {{nome_paciente}}, tel {{telefone_paciente}}, seu aniversário é {{dia_aniversario}}.",
      }),
    });

    const rendered = entity.render({
      patient: {
        name: "Maria",
        phone: "51999999999",
        birthDate: "1990-03-05",
      },
    });

    expect(rendered).toBe(
      "Olá Maria, tel 51999999999, seu aniversário é 05 de março.",
    );
  });

  it("should render empty dia_aniversario when birthDate is missing or invalid", () => {
    const entity = new BirthdayMessage({
      name: "x",
      sendTime: defaultSend,
      messageTemplate: new MessageTemplate({
        textTemplate: "{{dia_aniversario}}",
      }),
    });

    expect(
      entity.render({
        patient: { name: "A", phone: "1", birthDate: "" },
      }),
    ).toBe("");

    expect(
      entity.render({
        patient: { name: "A", phone: "1", birthDate: "invalid" },
      }),
    ).toBe("");

    expect(
      entity.render({
        patient: { name: "A", phone: "1", birthDate: undefined },
      }),
    ).toBe("");
  });

  it("should render dia_aniversario quando birthDate é Date (ex.: retorno Knex)", () => {
    const entity = new BirthdayMessage({
      name: "x",
      sendTime: defaultSend,
      messageTemplate: new MessageTemplate({
        textTemplate: "{{dia_aniversario}}",
      }),
    });

    const birthDate = new Date(Date.UTC(1990, 2, 5, 12, 0, 0));

    expect(
      entity.render({
        patient: { name: "A", phone: "1", birthDate },
      }),
    ).toBe("05 de março");
  });

  it("should throw ApiError when name is not a string", () => {
    expect(() => {
      new BirthdayMessage({
        name: 123 as unknown as string,
        sendTime: defaultSend,
        messageTemplate: new MessageTemplate({ textTemplate: "x" }),
      });
    }).toThrow(ApiError);
  });

  it("should return DTO including nested messageTemplate", () => {
    const messageTemplate = new MessageTemplate({
      id: "template-2",
      textTemplate: "Feliz aniversário {{nome_paciente}}",
    });

    const entity = new BirthdayMessage({
      id: "bd-2",
      name: "DTO test",
      sendTime: "11:15",
      messageTemplate,
    });

    expect(entity.getDTO()).toEqual({
      id: "bd-2",
      name: "DTO test",
      isActive: true,
      sendTime: "11:15",
      messageTemplate: {
        id: "template-2",
        textTemplate: "Feliz aniversário {{nome_paciente}}",
      },
    });
  });
});

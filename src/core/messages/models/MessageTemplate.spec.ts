import { MessageTemplate, MessageTemplateDTO } from "./MessageTemplate";

describe("MessageTemplate", () => {
  it("should initialize textTemplate and optional id", () => {
    const dto: MessageTemplateDTO = {
      id: "tpl-1",
      textTemplate: "Olá {{nome}}",
    };
    const template = new MessageTemplate(dto);

    expect(template.textTemplate).toBe("Olá {{nome}}");
    expect(template.id).toBe("tpl-1");
  });

  it("should generate id when omitted (Entity)", () => {
    const template = new MessageTemplate({
      textTemplate: "Texto",
    });

    expect(template.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("replaceVariables should substitute placeholders in {{variavel}} format", () => {
    const template = new MessageTemplate({
      textTemplate: "Olá {{nome}}, seu código é {{codigo}}.",
    });

    const result = template.replaceVariables({
      nome: "Maria",
      codigo: "ABC123",
    });

    expect(result).toBe("Olá Maria, seu código é ABC123.");
  });

  it("replaceVariables should replace the same variable multiple times", () => {
    const template = new MessageTemplate({
      textTemplate: "{{x}} e de novo {{x}}",
    });

    expect(template.replaceVariables({ x: "1" })).toBe("1 e de novo 1");
  });

  it("replaceVariables should trim spaces inside the placeholder name", () => {
    const template = new MessageTemplate({
      textTemplate: "Olá {{  nome  }}!",
    });

    expect(template.replaceVariables({ nome: "João" })).toBe("Olá João!");
  });

  it("replaceVariables should leave unknown placeholders unchanged", () => {
    const template = new MessageTemplate({
      textTemplate: "A: {{a}}, B: {{b}}",
    });

    const result = template.replaceVariables({ a: "1" });

    expect(result).toBe("A: 1, B: {{b}}");
  });

  it("replaceVariables should return the template unchanged when map is empty", () => {
    const text = "Sem vars ou {{faltando}}";
    const template = new MessageTemplate({ textTemplate: text });

    expect(template.replaceVariables({})).toBe(text);
  });

  it("replaceVariables should allow empty string as replacement value", () => {
    const template = new MessageTemplate({
      textTemplate: "Antes{{v}}Depois",
    });

    expect(template.replaceVariables({ v: "" })).toBe("AntesDepois");
  });

  it("getDTO should return id and textTemplate", () => {
    const dto: MessageTemplateDTO = {
      id: "id-99",
      textTemplate: "Hi {{user}}",
    };
    const template = new MessageTemplate(dto);

    expect(template.getDTO()).toEqual({
      id: template.id,
      textTemplate: "Hi {{user}}",
    });
  });
});

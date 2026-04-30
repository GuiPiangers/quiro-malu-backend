import { AfterScheduleMessage } from "../AfterScheduleMessage";
import { MessageTemplate } from "../MessageTemplate";

describe("AfterScheduleMessage", () => {
  it("should render nome_paciente como primeiro nome e nome_completo_paciente com nome inteiro", () => {
    const entity = new AfterScheduleMessage({
      name: "Pós",
      minutesAfterSchedule: 30,
      messageTemplate: new MessageTemplate({
        textTemplate: "{{nome_paciente}} / {{nome_completo_paciente}}",
      }),
    });

    const rendered = entity.render({
      patient: { name: "Ana Paula Ferreira", phone: "51988888888" },
    });

    expect(rendered).toBe("Ana / Ana Paula Ferreira");
  });
});

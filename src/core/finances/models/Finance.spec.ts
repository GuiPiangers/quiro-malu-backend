import { Finance, FinanceDTO } from "./Finance";
import { DateTime } from "../../shared/Date";

jest.mock("../../shared/Date", () => {
  return {
    DateTime: jest.fn().mockImplementation((date: string) => ({
      dateTime: `formatted-${date}`,
    })),
  };
});

describe("Finance", () => {
  const patientId = "patient-12345";
  const schedulingId = "scheduling-67890";

  const financeData: FinanceDTO = {
    date: "2024-01-01",
    description: "Consultation Fee",
    type: "income",
    paymentMethod: "credit_card",
    value: 150,
    patientId: patientId,
    schedulingId: schedulingId,
    service: "Chiropractic Adjustment",
  };

  it("should initialize properties correctly", () => {
    const finance = new Finance(financeData);

    expect(finance.date).toBe("formatted-2024-01-01");
    expect(finance.description).toBe("Consultation Fee");
    expect(finance.type).toBe("income");
    expect(finance.paymentMethod).toBe("credit_card");
    expect(finance.value).toBe(150);
    expect(finance.patientId).toBe(financeData.patientId);
    expect(finance.schedulingId).toBe(financeData.schedulingId);
    expect(finance.service).toBe("Chiropractic Adjustment");
  });

  it("should handle missing optional fields", () => {
    const minimalData: FinanceDTO = {
      date: "2024-02-01",
      description: "Office Rent",
      type: "expense",
      paymentMethod: "bank_transfer",
      value: 500,
    };

    const finance = new Finance(minimalData);

    expect(finance.patientId).toBeUndefined();
    expect(finance.schedulingId).toBeUndefined();
    expect(finance.service).toBeUndefined();
  });

  it("should return the correct DTO", () => {
    const finance = new Finance(financeData);
    const dto = finance.getDTO();

    expect(dto).toEqual({
      id: finance.id,
      date: "formatted-2024-01-01",
      description: "Consultation Fee",
      type: "income",
      paymentMethod: "credit_card",
      value: 150,
      patientId: financeData.patientId,
      schedulingId: financeData.schedulingId,
      service: "Chiropractic Adjustment",
    });
  });
});

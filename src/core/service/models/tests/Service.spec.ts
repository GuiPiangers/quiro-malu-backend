import { Service, ServiceDTO } from "../Service";

describe("Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create Service with provided id", () => {
    const mockId = "12345";

    const serviceData: ServiceDTO = {
      id: mockId,
      name: "Consultation",
      value: 100,
      duration: 60,
    };

    const service = new Service(serviceData);

    expect(service.id).toBe(mockId);
    expect(service.name).toBe("Consultation");
    expect(service.value).toBe(100);
    expect(service.duration).toBe(60);
  });

  test("should create Service with generated id if no id is provided", () => {
    const serviceData: ServiceDTO = {
      name: "Service",
      value: 150,
      duration: 60 * 60,
    };

    const service = new Service(serviceData);

    expect(service).toHaveProperty("id");
    expect(service.name).toBe("Service");
    expect(service.value).toBe(150);
    expect(service.duration).toBe(60 * 60);
  });

  test("should return correct ServiceDTO from getDTO", () => {
    const serviceData: ServiceDTO = {
      id: "service-123",
      name: "Massage",
      value: 200,
      duration: 120,
    };

    const service = new Service(serviceData);
    const serviceDTO = service.getDTO();

    expect(serviceDTO).toEqual({
      id: "service-123",
      name: "Massage",
      value: 200,
      duration: 120,
    });
  });
});

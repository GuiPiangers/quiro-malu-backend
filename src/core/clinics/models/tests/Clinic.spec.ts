import { Clinic } from "../Clinic";

describe("Clinic", () => {
  it("should create clinic dto", () => {
    const clinic = new Clinic({ name: "Clínica Teste" });

    expect(clinic.getDTO()).toEqual({
      id: clinic.id,
      name: "Clínica Teste",
    });
  });
});

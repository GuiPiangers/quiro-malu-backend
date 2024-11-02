import { ApiError } from "../../../../utils/ApiError";
import { Patient, PatientDTO } from "../Patient";

describe("Patient", () => {
  it("should create a Patient instance with valid data", () => {
    const patientData: PatientDTO = {
      id: "1",
      name: "John Doe",
      phone: "(12) 34567 8901",
      dateOfBirth: "2000-01-01T00:00",
      gender: "masculino",
      cpf: "123.456.789-09",
      location: { city: "City", state: "State" },
    };

    const patient = new Patient(patientData);

    expect(patient.id).toBe(patientData.id);
    expect(patient.name.value).toBe("John Doe");
    expect(patient.phone).toBe("(12) 34567 8901");
    expect(patient.dateOfBirth?.date).toBe("2000-01-01");
    expect(patient.gender).toBe("masculino");
    expect(patient.cpf).toBe("123.456.789-09");
    expect(patient.location?.getLocationDTO()).toEqual({
      city: "City",
      state: "State",
      address: null,
      cep: null,
      neighborhood: null,
    });
  });
  it("should create a id if it's not specified", () => {
    const patientData: PatientDTO = {
      id: "1",
      name: "John Doe",
      phone: "(12) 34567 8901",
    };

    const patient = new Patient(patientData);

    expect(patient).toHaveProperty("id");
  });

  it("should create a Patient instance without optional fields", () => {
    const patientData: PatientDTO = {
      id: "2",
      name: "Jane Doe",
      phone: "(34) 56789 0123",
    };

    const patient = new Patient(patientData);

    expect(patient.id).toBe(patientData.id);
    expect(patient.name.value).toBe("Jane Doe");
    expect(patient.phone).toBe("(34) 56789 0123");
    expect(patient.dateOfBirth).toBeNull();
    expect(patient.gender).toBeNull();
    expect(patient.cpf).toBeUndefined();
    expect(patient.location).toBeNull();
  });

  it("should throw an error if phone number format is invalid", () => {
    expect(
      () => new Patient({ name: "Invalid Phone", phone: "12345" }),
    ).toThrow(ApiError);
    expect(
      () => new Patient({ name: "Invalid Phone", phone: "12345" }),
    ).toThrow("Número de telefone fora do padrão esperado");
  });

  it("should throw an error if CPF format is invalid", () => {
    expect(
      () =>
        new Patient({
          name: "Invalid CPF",
          phone: "(12) 34567 8901",
          cpf: "invalid-cpf",
        }),
    ).toThrow(ApiError);
    expect(
      () =>
        new Patient({
          name: "Invalid CPF",
          phone: "(12) 34567 8901",
          cpf: "invalid-cpf",
        }),
    ).toThrow("CPF fora do padrão esperado");
  });

  it("should throw an error if date of birth is invalid", () => {
    expect(
      () =>
        new Patient({
          name: "Invalid Date",
          phone: "(12) 34567 8901",
          dateOfBirth: "invalid-date",
        }),
    ).toThrow(ApiError);
    expect(
      () =>
        new Patient({
          name: "Invalid Date",
          phone: "(12) 34567 8901",
          dateOfBirth: "invalid-date",
        }),
    ).toThrow("A data informada não é válida");
  });

  it("should return patient data as DTO", () => {
    const patientData: PatientDTO = {
      id: "3",
      name: "Alice Doe",
      phone: "(56) 12345 6789",
      dateOfBirth: "1990-10-10T00:00",
      gender: "feminino",
      cpf: "987.654.321-00",
      location: { city: "Another City", state: "Another State" },
    };

    const patient = new Patient(patientData);

    const patientDTO = patient.getPatientDTO();

    expect(patientDTO).toEqual({
      id: "3",
      name: "Alice Doe",
      phone: "(56) 12345 6789",
      dateOfBirth: "1990-10-10",
      gender: "feminino",
      cpf: "987.654.321-00",
      location: {
        city: "Another City",
        state: "Another State",
        address: null,
        cep: null,
        neighborhood: null,
      },
    });
  });
});

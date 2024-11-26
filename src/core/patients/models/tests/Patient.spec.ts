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
      address: undefined,
      cep: undefined,
      neighborhood: undefined,
    });
  });
  it("should create a id if it's not specified", () => {
    const patientData: PatientDTO = {
      name: "John Doe",
      phone: "(12) 34567 8901",
    };

    const patient = new Patient(patientData);

    expect(patient).toHaveProperty("id");
  });
  it("should create different hashData when name, phone or dateOfBirth is different", () => {
    const patientData: PatientDTO = {
      name: "John Doe",
      phone: "(12) 34567 8901",
      dateOfBirth: "1999-10-10",
    };
    const patientData2: PatientDTO = {
      ...patientData,
      name: "John Doe2",
    };
    const patientData3: PatientDTO = {
      ...patientData,
      phone: "(12) 34567 8902",
    };
    const patientData4: PatientDTO = {
      ...patientData,
      dateOfBirth: "1999-10-11",
    };

    const patient = new Patient(patientData);
    const patient2 = new Patient(patientData2);
    const patient3 = new Patient(patientData3);
    const patient4 = new Patient(patientData4);

    expect(patient).toHaveProperty("hashData");
    expect(patient.hashData).not.toBe(patient2.hashData);
    expect(patient.hashData).not.toBe(patient3.hashData);
    expect(patient.hashData).not.toBe(patient4.hashData);
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
    expect(patient.dateOfBirth).toBeUndefined();
    expect(patient.gender).toBeUndefined();
    expect(patient.cpf).toBeUndefined();
    expect(patient.location).toBeUndefined();
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
      hashData: patient.hashData,
      location: {
        city: "Another City",
        state: "Another State",
        address: undefined,
        cep: undefined,
        neighborhood: undefined,
      },
    });
  });
});

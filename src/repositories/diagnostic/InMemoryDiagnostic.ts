import { DiagnosticDTO } from "../../core/patients/models/Diagnostic";
import { IDiagnosticRepository } from "./IDiagnosticRepository";

export class InMemoryDiagnostic implements IDiagnosticRepository {
  saveMany(data: (DiagnosticDTO & { clinicId: string })[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private dbLocation: (DiagnosticDTO & {
    patientId: string;
    clinicId: string;
  })[] = [];

  async save(
    { patientId, ...data }: DiagnosticDTO,
    clinicId: string,
  ): Promise<void> {
    this.dbLocation.push({ ...data, patientId, clinicId });
  }

  async update(
    { patientId, ...data }: DiagnosticDTO,
    clinicId: string,
  ): Promise<void> {
    const index = this.dbLocation.findIndex((location) => {
      return (
        location.patientId === patientId && location.clinicId === clinicId
      );
    });
    this.dbLocation[index] = {
      ...data,
      patientId,
      clinicId: this.dbLocation[index].clinicId,
    };
  }

  async get(patientId: string, clinicId: string): Promise<DiagnosticDTO> {
    const selectedUser = await this.dbLocation.find(
      (location) =>
        location.patientId === patientId && location.clinicId === clinicId,
    );

    if (selectedUser) return selectedUser;
    else return { patientId: "" };
  }
}

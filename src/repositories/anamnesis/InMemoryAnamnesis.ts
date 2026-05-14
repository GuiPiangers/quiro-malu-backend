import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";
import { IAnamnesisRepository } from "./IAnamnesisRepository";

export class InMemoryAnamnesis implements IAnamnesisRepository {
  saveMany(data: (AnamnesisDTO & { clinicId: string })[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private dbLocation: (AnamnesisDTO & { patientId: string; clinicId: string })[] =
    [];

  async save(
    { patientId, ...data }: AnamnesisDTO,
    clinicId: string,
  ): Promise<void> {
    this.dbLocation.push({ ...data, patientId, clinicId });
  }

  async update(
    { patientId, ...data }: AnamnesisDTO,
    clinicId: string,
  ): Promise<void> {
    const index = this.dbLocation.findIndex((location) => {
      return location.patientId === patientId && location.clinicId === clinicId;
    });
    this.dbLocation[index] = {
      ...data,
      patientId,
      clinicId: this.dbLocation[index].clinicId,
    };
  }

  async get(patientId: string, clinicId: string): Promise<AnamnesisDTO> {
    const selectedUser = await this.dbLocation.find(
      (location) =>
        location.patientId === patientId && location.clinicId === clinicId,
    );

    if (selectedUser) return selectedUser;
    else return { patientId: "" };
  }
}

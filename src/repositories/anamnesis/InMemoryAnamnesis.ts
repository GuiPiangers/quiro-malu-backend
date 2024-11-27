import { AnamnesisDTO } from "../../core/patients/models/Anamnesis";
import { IAnamnesisRepository } from "./IAnamnesisRepository";

export class InMemoryAnamnesis implements IAnamnesisRepository {
  saveMany(data: (AnamnesisDTO & { userId: string })[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private dbLocation: (AnamnesisDTO & { patientId: string; userId: string })[] =
    [];

  async save(
    { patientId, ...data }: AnamnesisDTO,
    userId: string,
  ): Promise<void> {
    this.dbLocation.push({ ...data, patientId, userId });
  }

  async update({ patientId, ...data }: AnamnesisDTO): Promise<void> {
    const index = this.dbLocation.findIndex((location) => {
      return location.patientId === patientId;
    });
    this.dbLocation[index] = {
      ...data,
      patientId,
      userId: this.dbLocation[index].userId,
    };
  }

  async get(patientId: string): Promise<AnamnesisDTO[]> {
    const selectedUser = await this.dbLocation.find(
      (location) => location.patientId === patientId,
    );

    if (selectedUser) return [selectedUser];
    else return [];
  }
}

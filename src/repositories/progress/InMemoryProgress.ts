import { ProgressDTO } from "../../core/patients/models/Progress";
import { IProgressRepository } from "./IProgressRepository";

export class InMemoryLocation implements IProgressRepository {
  getByScheduling(data: {
    schedulingId: string;
    patientId: string;
    userId: string;
  }): Promise<ProgressDTO[]> {
    throw new Error("Method not implemented.");
  }

  private dbProgress: (ProgressDTO & { patientId: string; userId: string })[] =
    [];

  async count(data: {
    patientId: string;
    userId: string;
  }): Promise<[{ total: number }]> {
    const total = this.dbProgress.filter(
      (progress) =>
        progress.patientId === data.patientId &&
        progress.userId === data.userId,
    ).length;

    return [{ total }];
  }

  async save({
    patientId,
    userId,
    ...data
  }: ProgressDTO & { userId: string }): Promise<void> {
    this.dbProgress.push({ ...data, patientId, userId });
  }

  async update({
    id,
    patientId,
    userId,
    ...data
  }: ProgressDTO & { userId: string }): Promise<void> {
    const index = this.dbProgress.findIndex((progress) => {
      return (
        progress.patientId === patientId &&
        progress.userId === userId &&
        progress.id === id
      );
    });
    this.dbProgress[index] = {
      ...data,
      patientId,
      userId: this.dbProgress[index].userId,
    };
  }

  async get({
    id,
    patientId,
    userId,
  }: {
    id: string;
    patientId: string;
    userId: string;
  }): Promise<ProgressDTO[]> {
    const selectedUser = await this.dbProgress.find(
      (progress) =>
        progress.id === id &&
        progress.patientId === patientId &&
        progress.userId === userId,
    );

    if (selectedUser) return [selectedUser];
    else return [];
  }

  async list({
    patientId,
    userId,
  }: {
    id: string;
    patientId: string;
    userId: string;
  }): Promise<ProgressDTO[]> {
    const selectedUser = await this.dbProgress.filter(
      (progress) =>
        progress.patientId === patientId && progress.userId === userId,
    );

    if (selectedUser) return selectedUser;
    else return [];
  }

  async delete({
    id,
    patientId,
    userId,
  }: {
    id: string;
    patientId: string;
    userId: string;
  }): Promise<void> {
    await this.dbProgress.find(
      (progress) =>
        progress.id === id &&
        progress.patientId === patientId &&
        progress.userId === userId,
    );
  }
}

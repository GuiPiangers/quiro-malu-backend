import { ServiceDTO } from "../../core/service/models/Service";
import { IServiceRepository } from "./IServiceRepository";

interface inMemoryInterface extends ServiceDTO {
  userId: string;
}

export class InMemoryServiceRepository implements IServiceRepository {
  private dbServices: inMemoryInterface[] = [];

  count({ userId }: { userId: string }): Promise<[{ total: number }]> {
    throw new Error("Method not implemented.");
  }

  async delete({ id, userId }: { id: string; userId: string }): Promise<void> {
    this.dbServices = this.dbServices.filter(
      (service) => service.id !== id && service.userId === userId,
    );
  }

  async update({
    userId,
    ...data
  }: ServiceDTO & { userId: string }): Promise<void> {
    const index = this.dbServices.findIndex((service) => {
      return service.userId === userId && service.id === data.id;
    });
    this.dbServices[index] = { ...data, userId };
  }

  async save({
    userId,
    ...data
  }: ServiceDTO & { userId: string }): Promise<void> {
    this.dbServices.push({ ...data, userId });
  }

  async list({ userId }: { userId: string }): Promise<ServiceDTO[]> {
    return this.dbServices.filter((Service) => Service.userId === userId);
  }

  async get({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<ServiceDTO[]> {
    return this.dbServices.filter((Service) => {
      return Service.id === id && Service.userId === userId;
    });
  }

  async getByName({
    name,
    userId,
  }: {
    name: string;
    userId: string;
  }): Promise<ServiceDTO[]> {
    const result = this.dbServices.filter(
      (service) => service.name === name && service.userId === userId,
    );
    return result;
  }
}

import { ServiceDTO } from "../../core/service/models/Service";

export type listServiceProps = {
  userId: string;
  config?: { limit?: number; offSet?: number; search?: string };
};

export interface IServiceRepository {
  save(data: ServiceDTO & { userId: string }): Promise<void>;
  update({
    userId,
    id,
    ...data
  }: ServiceDTO & { userId: string; id: string }): Promise<void>;
  list(data: listServiceProps): Promise<ServiceDTO[]>;
  count({ userId }: { userId: string }): Promise<[{ total: number }]>;
  get(data: { id: string; userId: string }): Promise<ServiceDTO[]>;
  getByName(data: { name: string; userId: string }): Promise<ServiceDTO[]>;
  delete(data: { id: string; userId: string }): Promise<void>;
}

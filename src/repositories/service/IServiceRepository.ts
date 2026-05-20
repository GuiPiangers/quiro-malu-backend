import { ServiceDTO } from "../../core/service/models/Service";

export type listServiceProps = {
  clinicId: string;
  config?: { limit?: number; offSet?: number; search?: string };
};

export interface IServiceRepository {
  save(data: ServiceDTO & { clinicId: string }): Promise<void>;
  update({
    clinicId,
    id,
    ...data
  }: ServiceDTO & { clinicId: string; id: string }): Promise<void>;
  list(data: listServiceProps): Promise<ServiceDTO[]>;
  count({
    clinicId,
  }: {
    clinicId: string;
    search?: string;
  }): Promise<[{ total: number }]>;
  get(data: { id: string; clinicId: string }): Promise<ServiceDTO | null>;
  getByName(data: { name: string; clinicId: string }): Promise<ServiceDTO[]>;
  delete(data: { id: string; clinicId: string }): Promise<void>;
}

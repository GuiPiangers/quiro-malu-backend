import { FinanceDTO } from "../../core/finances/models/Finance";

export type setFinanceProps = FinanceDTO & { clinicId: string };
export type updateFinanceProps = FinanceDTO & { clinicId: string; id: string };
export type deleteFinanceProps = { clinicId: string; id: string };
export type getFinanceProps = { clinicId: string; id: string };
export type getBySchedulingFinanceProps = {
  clinicId: string;
  schedulingId: string;
};
export type listFinanceProps = {
  clinicId: string;
  yearAndMonth: string;
  config?: { limit: number; offSet: number };
};

export interface IFinanceRepository {
  create(data: setFinanceProps): Promise<void>;
  update(data: updateFinanceProps): Promise<void>;
  delete(data: deleteFinanceProps): Promise<void>;
  get(data: getFinanceProps): Promise<FinanceDTO>;
  getByScheduling(data: getBySchedulingFinanceProps): Promise<FinanceDTO>;
  list(data: listFinanceProps): Promise<FinanceDTO[]>;
}

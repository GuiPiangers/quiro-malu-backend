import { FinanceDTO } from "../../core/finances/models/Finance";

export type setFinanceProps = FinanceDTO & { userId: string };
export type updateFinanceProps = FinanceDTO & { userId: string; id: string };
export type deleteFinanceProps = { userId: string; id: string };
export type getFinanceProps = { userId: string; id: string };
export type getBySchedulingFinanceProps = {
  userId: string;
  schedulingId: string;
};
export type listFinanceProps = {
  userId: string;
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

import { Finance, FinanceDTO } from "../../core/finances/models/Finance";

export type createFinanceProps = FinanceDTO & { userId: string };
export type updateFinanceProps = FinanceDTO & { userId: string };
export type deleteFinanceProps = { userId: string };
export type getFinanceProps = { userId: string; id: string };
export type listFinanceProps = {
  userId: string;
  congif?: { limit: number; offset: number };
};

export interface IFinanceRepository {
  create(data: createFinanceProps): Promise<void>;
  update(data: updateFinanceProps): Promise<void>;
  delete(data: deleteFinanceProps): Promise<void>;
  get(data: getFinanceProps): Promise<Finance>;
  lsit(data: listFinanceProps): Promise<FinanceDTO[]>;
}

import { Finance, FinanceDOT } from "../../core/finances/models/Finance";

type createFinanceProps = FinanceDOT & { userId: string };
type deleteFinanceProps = { userId: string };
type getFinanceProps = { userId: string; id: string };
type listFinanceProps = {
  userId: string;
  congif?: { limit: number; offset: number };
};

export interface IFinanceRepository {
  create(data: createFinanceProps): void;
  update(data: createFinanceProps): void;
  delete(data: deleteFinanceProps): void;
  get(data: getFinanceProps): Finance;
  lsit(data: listFinanceProps): Finance[];
}

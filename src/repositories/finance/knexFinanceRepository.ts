import { Finance } from "../../core/finances/models/Finance";
import {
  createFinanceProps,
  deleteFinanceProps,
  getFinanceProps,
  IFinanceRepository,
  listFinanceProps,
} from "./IFinanceRepository";

export class KnexFinanceRepository implements IFinanceRepository {
  create(data: createFinanceProps): Promise<void> {
    throw new Error("Method not implemented.");
  }

  update(data: createFinanceProps): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(data: deleteFinanceProps): Promise<void> {
    throw new Error("Method not implemented.");
  }

  get(data: getFinanceProps): Promise<Finance> {
    throw new Error("Method not implemented.");
  }

  lsit(data: listFinanceProps): Promise<Finance[]> {
    throw new Error("Method not implemented.");
  }
}

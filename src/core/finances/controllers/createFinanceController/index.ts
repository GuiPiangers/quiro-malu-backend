import { CreateFinanceController } from "./createFinanceController";
import { CreateFinanceUseCase } from "../../useCases/createFinance/createFinanceUseCase";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";

const financeRepository = new KnexFinanceRepository();
const createFinanceUseCase = new CreateFinanceUseCase(financeRepository);
const createFiannceController = new CreateFinanceController(
  createFinanceUseCase,
);

export { createFiannceController };

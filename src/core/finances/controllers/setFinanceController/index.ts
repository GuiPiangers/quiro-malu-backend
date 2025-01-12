import { SetFinanceController } from "./setFinanceController";
import { SetFinanceUseCase } from "../../useCases/setFinance/setFinanceUseCase";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";

const financeRepository = new KnexFinanceRepository();
const createFinanceUseCase = new SetFinanceUseCase(financeRepository);
const createFinanceController = new SetFinanceController(createFinanceUseCase);

export { createFinanceController };

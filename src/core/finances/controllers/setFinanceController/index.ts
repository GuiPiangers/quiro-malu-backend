import { SetFinanceController } from "./setFinanceController";
import { SetFinanceUseCase } from "../../useCases/setFinance/setFinanceUseCase";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";

const financeRepository = new KnexFinanceRepository();
const setFinanceUseCase = new SetFinanceUseCase(financeRepository);
const setFinanceController = new SetFinanceController(setFinanceUseCase);

export { setFinanceController };

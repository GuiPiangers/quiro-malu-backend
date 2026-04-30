import { SetFinanceController } from "./setFinanceController";
import { SetFinanceUseCase } from "../../useCases/setFinance/setFinanceUseCase";
import { knexFinanceRepository } from "../../../../repositories/finance/knexInstances";

const financeRepository = knexFinanceRepository;
const setFinanceUseCase = new SetFinanceUseCase(financeRepository);
const setFinanceController = new SetFinanceController(setFinanceUseCase);

export { setFinanceController };
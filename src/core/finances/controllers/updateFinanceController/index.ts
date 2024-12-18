import { UpdateFinanceController } from "./updateFinanceController";
import { UpdateFinanceUseCase } from "../../useCases/updateFinance/updateFinanceUseCase";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";

const financeRepository = new KnexFinanceRepository();
const updateFinanceUseCase = new UpdateFinanceUseCase(financeRepository);
const updateFinanceController = new UpdateFinanceController(
  updateFinanceUseCase,
);

export { updateFinanceController };

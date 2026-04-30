import { UpdateFinanceController } from "./updateFinanceController";
import { UpdateFinanceUseCase } from "../../useCases/updateFinance/updateFinanceUseCase";
import { knexFinanceRepository } from "../../../../repositories/finance/knexInstances";

const financeRepository = knexFinanceRepository;
const updateFinanceUseCase = new UpdateFinanceUseCase(financeRepository);
const updateFinanceController = new UpdateFinanceController(
  updateFinanceUseCase,
);

export { updateFinanceController };
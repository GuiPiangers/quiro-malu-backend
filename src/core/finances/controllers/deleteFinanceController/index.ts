import { DeleteFinanceUseCase } from "../../useCases/deleteFinance/deleteFinanceUseCase";
import { DeleteFinanceController } from "./deleteFinanceController";
import { knexFinanceRepository } from "../../../../repositories/finance/knexInstances";

const financeRepository = knexFinanceRepository;
const deleteFinanceUseCase = new DeleteFinanceUseCase(financeRepository);
const deleteFinanceController = new DeleteFinanceController(
  deleteFinanceUseCase,
);

export { deleteFinanceController };
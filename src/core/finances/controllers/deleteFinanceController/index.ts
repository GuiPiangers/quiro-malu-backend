import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";
import { DeleteFinanceUseCase } from "../../useCases/deleteFinance/deleteFinanceUseCase";
import { DeleteFinanceController } from "./deleteFinanceController";

const financeRepository = new KnexFinanceRepository();
const deleteFinanceUseCase = new DeleteFinanceUseCase(financeRepository);
const deleteFinanceController = new DeleteFinanceController(
  deleteFinanceUseCase,
);

export { deleteFinanceController };

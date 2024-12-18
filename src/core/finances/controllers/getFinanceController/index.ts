import { GetFinanceController } from "./getFinanceController";
import { GetFinanceUseCase } from "../../useCases/getFinance/getFinanceUseCase";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";

const financeRepository = new KnexFinanceRepository();
const getFinanceUseCase = new GetFinanceUseCase(financeRepository);
const getFinanceController = new GetFinanceController(getFinanceUseCase);

export { getFinanceController };

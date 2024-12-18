import { GetFinanceController } from "./getFinanceController";
import { GetFinanceUseCase } from "../../useCases/getFinance/getFinanceUseCase";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";

const financeRepository = new KnexFinanceRepository();
const getFinanceUseCase = new GetFinanceUseCase(financeRepository);
const getFiannceController = new GetFinanceController(getFinanceUseCase);

export { getFiannceController };

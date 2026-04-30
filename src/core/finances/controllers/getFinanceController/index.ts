import { GetFinanceController } from "./getFinanceController";
import { GetFinanceUseCase } from "../../useCases/getFinance/getFinanceUseCase";
import { knexFinanceRepository } from "../../../../repositories/finance/knexInstances";

const financeRepository = knexFinanceRepository;
const getFinanceUseCase = new GetFinanceUseCase(financeRepository);
const getFinanceController = new GetFinanceController(getFinanceUseCase);

export { getFinanceController };
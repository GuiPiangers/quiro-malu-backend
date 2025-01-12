import { GetFinanceBySchedulingController } from "./getFinanceBySchedulingController";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";
import { GetFinanceBySchedulingUseCase } from "../../useCases/getFinanceByScheduling/getFinanceByScheduling";

const financeRepository = new KnexFinanceRepository();
const getFinanceBySchedulingUseCase = new GetFinanceBySchedulingUseCase(
  financeRepository,
);
const getFinanceBySchedulingController = new GetFinanceBySchedulingController(
  getFinanceBySchedulingUseCase,
);

export { getFinanceBySchedulingController };

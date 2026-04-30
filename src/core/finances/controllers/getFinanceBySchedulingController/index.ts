import { GetFinanceBySchedulingController } from "./getFinanceBySchedulingController";
import { GetFinanceBySchedulingUseCase } from "../../useCases/getFinanceByScheduling/getFinanceByScheduling";
import { knexFinanceRepository } from "../../../../repositories/finance/knexInstances";

const financeRepository = knexFinanceRepository;
const getFinanceBySchedulingUseCase = new GetFinanceBySchedulingUseCase(
  financeRepository,
);
const getFinanceBySchedulingController = new GetFinanceBySchedulingController(
  getFinanceBySchedulingUseCase,
);

export { getFinanceBySchedulingController };
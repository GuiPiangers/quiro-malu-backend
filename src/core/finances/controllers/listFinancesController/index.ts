import { ListFinancesController } from "./listFinancesController";
import { ListFinancesUseCase } from "../../useCases/listFinances/listFinancesUseCase";
import { knexFinanceRepository } from "../../../../repositories/finance/knexInstances";

const financesRepository = knexFinanceRepository;
const listFinancesUseCase = new ListFinancesUseCase(financesRepository);
const listFinanceController = new ListFinancesController(listFinancesUseCase);

export { listFinanceController };
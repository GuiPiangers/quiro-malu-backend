import { ListFinancesController } from "./listFinancesController";
import { ListFinancesUseCase } from "../../useCases/listFinances/listFinancesUseCase";
import { KnexFinanceRepository } from "../../../../repositories/finance/knexFinanceRepository";

const financesRepository = new KnexFinanceRepository();
const listFinancesUseCase = new ListFinancesUseCase(financesRepository);
const listFiannceController = new ListFinancesController(listFinancesUseCase);

export { listFiannceController };

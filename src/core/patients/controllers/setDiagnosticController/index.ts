import { MySqlDiagnosticRepository } from "../../../../repositories/diagnostic/MySqlDiagnosticRepository";
import { SetDiagnosticUseCase } from "../../useCases/setDiagnostic/SetDiagnosticUseCase";
import { SetDiagnosticController } from "./SetDiagnosticController";

const DiagnosticRepository = new MySqlDiagnosticRepository()
const setDiagnosticUseCase = new SetDiagnosticUseCase(DiagnosticRepository)
const setDiagnosticController = new SetDiagnosticController(setDiagnosticUseCase)

export { setDiagnosticController }
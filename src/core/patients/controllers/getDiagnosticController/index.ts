import { MySqlDiagnosticRepository } from "../../../../repositories/diagnostic/MySqlDiagnosticRepository";
import { GetDiagnosticUseCase } from "../../useCases/getDiagnostic/GetDiagnosticUseCase";
import { GetDiagnosticController } from "./GetDiagnosticController";

const DiagnosticRepository = new MySqlDiagnosticRepository()
const getDiagnosticUseCase = new GetDiagnosticUseCase(DiagnosticRepository)
const getDiagnosticController = new GetDiagnosticController(getDiagnosticUseCase)

export { getDiagnosticController }
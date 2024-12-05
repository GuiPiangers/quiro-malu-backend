import { KnexDiagnosticRepository } from "../../../../repositories/diagnostic/KnexDiagnosticRepository";
import { SetDiagnosticUseCase } from "../../useCases/diagnostic/setDiagnostic/SetDiagnosticUseCase";
import { SetDiagnosticController } from "./SetDiagnosticController";

const DiagnosticRepository = new KnexDiagnosticRepository()
const setDiagnosticUseCase = new SetDiagnosticUseCase(DiagnosticRepository)
const setDiagnosticController = new SetDiagnosticController(setDiagnosticUseCase)

export { setDiagnosticController }
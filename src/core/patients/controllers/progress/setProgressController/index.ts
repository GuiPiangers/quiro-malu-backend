import { setProgressUseCaseFactory } from "../../../../shared/factories/setProgressUseCaseFactory";
import { SetProgressController } from "./SetProgressController";

const setProgressUseCase = setProgressUseCaseFactory();
const setProgressController = new SetProgressController(setProgressUseCase);

export { setProgressController };

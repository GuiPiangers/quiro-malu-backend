import { updateSchedulingUseCaseFactory } from "../../../shared/factories/updateSchedulingUseCaseFactory";
import { UpdateSchedulingController } from "./UpdateSchedulingController";

const updateSchedulingUseCase = updateSchedulingUseCaseFactory();
const updateSchedulingController = new UpdateSchedulingController(
  updateSchedulingUseCase,
);

export { updateSchedulingController };

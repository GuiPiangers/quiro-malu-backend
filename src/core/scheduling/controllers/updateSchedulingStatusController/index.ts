import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { UpdateSchedulingStatusUseCase } from "../../useCases/updateSchedulingStatus/UpdateSchedulingStatus";
import { UpdateSchedulingController } from "./UpdateSchedulingController";

const schedulingRepository = new MySqlSchedulingRepository();
const updateSchedulingStatusUseCase = new UpdateSchedulingStatusUseCase(
  schedulingRepository,
);
const updateSchedulingStatusController = new UpdateSchedulingController(
  updateSchedulingStatusUseCase,
);

export { updateSchedulingStatusController };

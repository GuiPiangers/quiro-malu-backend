import { deleteBeforeScheduleMessageUseCase } from "../../useCases/deleteBeforeScheduleMessage";
import { DeleteBeforeScheduleMessageController } from "./DeleteBeforeScheduleMessageController";

const deleteBeforeScheduleMessageController = new DeleteBeforeScheduleMessageController(
  deleteBeforeScheduleMessageUseCase,
);

export { deleteBeforeScheduleMessageController };

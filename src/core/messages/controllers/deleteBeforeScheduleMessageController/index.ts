import { deleteBeforeScheduleMessageUseCase } from "../../useCases/beforeScheduleMessage/deleteBeforeScheduleMessage";
import { DeleteBeforeScheduleMessageController } from "./DeleteBeforeScheduleMessageController";

const deleteBeforeScheduleMessageController = new DeleteBeforeScheduleMessageController(
  deleteBeforeScheduleMessageUseCase,
);

export { deleteBeforeScheduleMessageController };

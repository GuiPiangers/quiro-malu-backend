import { updateBirthdayMessageUseCase } from "../../useCases/birthdayMessage/updateBirthdayMessage";
import { UpdateBirthdayMessageController } from "./UpdateBirthdayMessageController";

const updateBirthdayMessageController = new UpdateBirthdayMessageController(
  updateBirthdayMessageUseCase,
);

export { updateBirthdayMessageController };

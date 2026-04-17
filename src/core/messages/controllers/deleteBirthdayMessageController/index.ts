import { deleteBirthdayMessageUseCase } from "../../useCases/birthdayMessage/deleteBirthdayMessage";
import { DeleteBirthdayMessageController } from "./DeleteBirthdayMessageController";

const deleteBirthdayMessageController = new DeleteBirthdayMessageController(
  deleteBirthdayMessageUseCase,
);

export { deleteBirthdayMessageController };

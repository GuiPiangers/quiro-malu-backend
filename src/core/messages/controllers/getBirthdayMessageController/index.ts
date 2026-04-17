import { getBirthdayMessageUseCase } from "../../useCases/birthdayMessage/getBirthdayMessage";
import { GetBirthdayMessageController } from "./GetBirthdayMessageController";

const getBirthdayMessageController = new GetBirthdayMessageController(
  getBirthdayMessageUseCase,
);

export { getBirthdayMessageController };

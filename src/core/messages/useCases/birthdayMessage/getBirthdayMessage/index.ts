import { birthdayMessageRepository } from "../../../../../repositories/messages/knexInstances";
import { GetBirthdayMessageUseCase } from "./GetBirthdayMessageUseCase";

const getBirthdayMessageUseCase = new GetBirthdayMessageUseCase(
  birthdayMessageRepository,
);

export { getBirthdayMessageUseCase };

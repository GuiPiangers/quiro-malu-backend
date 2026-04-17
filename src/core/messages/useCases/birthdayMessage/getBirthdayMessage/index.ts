import { BirthdayMessageRepository } from "../../../../../repositories/messages/BirthdayMessageRepository";
import { GetBirthdayMessageUseCase } from "./GetBirthdayMessageUseCase";

const birthdayMessageRepository = new BirthdayMessageRepository();

const getBirthdayMessageUseCase = new GetBirthdayMessageUseCase(
  birthdayMessageRepository,
);

export { getBirthdayMessageUseCase };

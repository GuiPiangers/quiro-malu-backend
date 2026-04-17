import { AfterScheduleMessageRepository } from "../../../../../repositories/messages/AfterScheduleMessageRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { UpdateAfterScheduleMessageUseCase } from "./UpdateAfterScheduleMessageUseCase";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const updateAfterScheduleMessageUseCase = new UpdateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

export { updateAfterScheduleMessageUseCase };

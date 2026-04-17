import { AfterScheduleMessageRepository } from "../../../../../repositories/messages/AfterScheduleMessageRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { CreateAfterScheduleMessageUseCase } from "./CreateAfterScheduleMessageUseCase";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const createAfterScheduleMessageUseCase = new CreateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

export { createAfterScheduleMessageUseCase };

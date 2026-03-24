import { BeforeScheduleMessageRepository } from "../../../../repositories/messages/BeforeScheduleMessageRepository";
import { appEventListener } from "../../../shared/observers/EventListener";
import { CreateBeforeScheduleMessageUseCase } from "./CreateBeforeScheduleMessageUseCase";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const createBeforeScheduleMessageUseCase = new CreateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

export { createBeforeScheduleMessageUseCase };

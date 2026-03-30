import { BeforeScheduleMessageRepository } from "../../../../repositories/messages/BeforeScheduleMessageRepository";
import { appEventListener } from "../../../shared/observers/EventListener";
import { UpdateBeforeScheduleMessageUseCase } from "./UpdateBeforeScheduleMessageUseCase";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const updateBeforeScheduleMessageUseCase = new UpdateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

export { updateBeforeScheduleMessageUseCase };

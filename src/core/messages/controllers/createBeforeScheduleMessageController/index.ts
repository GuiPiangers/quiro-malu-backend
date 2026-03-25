import { appEventListener } from "../../../shared/observers/EventListener";
import { BeforeScheduleMessageRepository } from "../../../../repositories/messages/BeforeScheduleMessageRepository";
import { CreateBeforeScheduleMessageUseCase } from "../../useCases/createBeforeScheduleMessage/CreateBeforeScheduleMessageUseCase";
import { CreateBeforeScheduleMessageController } from "./CreateBeforeScheduleMessageController";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const createBeforeScheduleMessageUseCase = new CreateBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  appEventListener,
);

const createBeforeScheduleMessageController = new CreateBeforeScheduleMessageController(
  createBeforeScheduleMessageUseCase,
);

export { createBeforeScheduleMessageController };

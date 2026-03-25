import { BeforeScheduleMessageRepository } from "../../../../repositories/messages/BeforeScheduleMessageRepository";
import { ListBeforeScheduleMessagesUseCase } from "../../useCases/listBeforeScheduleMessages/ListBeforeScheduleMessagesUseCase";
import { ListBeforeScheduleMessagesController } from "./ListBeforeScheduleMessagesController";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const listBeforeScheduleMessagesUseCase = new ListBeforeScheduleMessagesUseCase(
  beforeScheduleMessageRepository,
);

const listBeforeScheduleMessagesController = new ListBeforeScheduleMessagesController(
  listBeforeScheduleMessagesUseCase,
);

export { listBeforeScheduleMessagesController };

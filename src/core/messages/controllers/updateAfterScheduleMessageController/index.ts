import { appEventListener } from "../../../shared/observers/EventListener";
import { AfterScheduleMessageRepository } from "../../../../repositories/messages/AfterScheduleMessageRepository";
import { UpdateAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/updateAfterScheduleMessage/UpdateAfterScheduleMessageUseCase";
import { UpdateAfterScheduleMessageController } from "./UpdateAfterScheduleMessageController";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const updateAfterScheduleMessageUseCase = new UpdateAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  appEventListener,
);

const updateAfterScheduleMessageController = new UpdateAfterScheduleMessageController(
  updateAfterScheduleMessageUseCase,
);

export { updateAfterScheduleMessageController };

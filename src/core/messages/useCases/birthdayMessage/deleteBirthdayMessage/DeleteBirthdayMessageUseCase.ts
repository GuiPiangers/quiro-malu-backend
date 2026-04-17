import { IBirthdayMessageRepository } from "../../../../../repositories/messages/IBirthdayMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";

export class DeleteBirthdayMessageUseCase {
  constructor(
    private birthdayMessageRepository: IBirthdayMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute({ id, userId }: { id: string; userId: string }): Promise<void> {
    const existing = await this.birthdayMessageRepository.getById({
      id,
      userId,
    });

    if (!existing) {
      throw new ApiError("Campanha de aniversário não encontrada", 404);
    }

    await this.birthdayMessageRepository.delete({ id, userId });

    this.appEventListener.emit("birthdayMessageDelete", { id });
  }
}

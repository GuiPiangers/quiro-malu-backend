import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { DeleteBirthdayMessageUseCase } from "../../useCases/birthdayMessage/deleteBirthdayMessage/DeleteBirthdayMessageUseCase";
import { MessageEntityIdParamSchema } from "../messagesCommonSchemas";

export class DeleteBirthdayMessageController {
  constructor(
    private deleteBirthdayMessageUseCase: DeleteBirthdayMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const { id } = parsedParams.data;
      const userId = request.user.id!;

      await this.deleteBirthdayMessageUseCase.execute({ id, userId });

      return response.status(200).json({ message: "Mensagem de aniversário deletada com sucesso" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

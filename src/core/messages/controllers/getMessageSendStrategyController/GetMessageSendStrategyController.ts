import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { GetMessageSendStrategyUseCase } from "../../useCases/messageSendStrategy/getMessageSendStrategy/GetMessageSendStrategyUseCase";
import { MessageEntityIdParamSchema } from "../messagesCommonSchemas";

export class GetMessageSendStrategyController {
  constructor(
    private readonly getMessageSendStrategyUseCase: GetMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const { id } = parsedParams.data;
      const userId = request.user.id!;

      const res = await this.getMessageSendStrategyUseCase.execute({
        userId,
        clinicId: request.user.clinicId as string,
        strategyId: id,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

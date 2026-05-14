import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { buildValidatedUpdateMessageSendStrategyBody } from "../../http/validateMessageSendStrategyUpdateHttpInput";
import {
  type UpdateMessageSendStrategyDTO,
  UpdateMessageSendStrategyUseCase,
} from "../../useCases/messageSendStrategy/updateMessageSendStrategy/UpdateMessageSendStrategyUseCase";
import { MessageEntityIdParamSchema } from "../messagesCommonSchemas";
import { UpdateMessageSendStrategyBodySchema } from "../messageSendStrategyHttpSchemas";

export class UpdateMessageSendStrategyController {
  constructor(
    private readonly updateMessageSendStrategyUseCase: UpdateMessageSendStrategyUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }
    const parsedBody = parseWithSchema(UpdateMessageSendStrategyBodySchema, request.body);
    if (!parsedBody.success) {
      return sendZodBadRequest(response, parsedBody.error);
    }

    try {
      const { id } = parsedParams.data;
      const rawBody = parsedBody.data;
      const userId = request.user.id!;
      const clinicId = request.user.clinicId!;

      const body = buildValidatedUpdateMessageSendStrategyBody(
        rawBody as Pick<UpdateMessageSendStrategyDTO, "name" | "kind" | "params">,
      );

      const res = await this.updateMessageSendStrategyUseCase.execute({
        userId,
        clinicId,
        strategyId: id,
        ...body,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

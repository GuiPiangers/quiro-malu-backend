import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { GetAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/getAfterScheduleMessage/GetAfterScheduleMessageUseCase";
import { MessageEntityIdParamSchema } from "../messagesCommonSchemas";

export class GetAfterScheduleMessageController {
  constructor(
    private getAfterScheduleMessageUseCase: GetAfterScheduleMessageUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    const parsedParams = parseWithSchema(MessageEntityIdParamSchema, request.params);
    if (!parsedParams.success) {
      return sendZodBadRequest(response, parsedParams.error);
    }

    try {
      const userId = request.user.id!;
      const { id } = parsedParams.data;

      const res = await this.getAfterScheduleMessageUseCase.execute({
        id,
        userId,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

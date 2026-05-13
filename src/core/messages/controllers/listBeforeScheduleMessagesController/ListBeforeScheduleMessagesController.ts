import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListBeforeScheduleMessagesUseCase } from "../../useCases/beforeScheduleMessage/listBeforeScheduleMessages/ListBeforeScheduleMessagesUseCase";
import { ListPageLimitQuerySchema } from "../messagesCommonSchemas";

export class ListBeforeScheduleMessagesController {
  constructor(private listBeforeScheduleMessagesUseCase: ListBeforeScheduleMessagesUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListPageLimitQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const userId = request.user.id;
      const { page, limit } = parsed.data;

      const res = await this.listBeforeScheduleMessagesUseCase.execute({
        userId: userId!,
        page,
        limit,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

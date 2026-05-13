import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { parseWithSchema, sendZodBadRequest } from "../../../../utils/zodValidation";
import { ListBirthdayMessagesUseCase } from "../../useCases/birthdayMessage/listBirthdayMessages/ListBirthdayMessagesUseCase";
import { ListPageLimitQuerySchema } from "../messagesCommonSchemas";

export class ListBirthdayMessagesController {
  constructor(private listBirthdayMessagesUseCase: ListBirthdayMessagesUseCase) {}

  async handle(request: Request, response: Response) {
    const parsed = parseWithSchema(ListPageLimitQuerySchema, request.query);
    if (!parsed.success) {
      return sendZodBadRequest(response, parsed.error);
    }

    try {
      const userId = request.user.id!;
      const { page, limit } = parsed.data;

      const res = await this.listBirthdayMessagesUseCase.execute({
        userId,
        page,
        limit,
      });

      return response.status(200).json(res);
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

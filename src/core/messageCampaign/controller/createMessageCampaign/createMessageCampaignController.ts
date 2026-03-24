import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";
import { CreateMessageCampaignUseCase } from "../../useCases/createMessageCampaign/createMessageCampaignUseCase";
import { MessageCampaignDTO } from "../../models/MessageCampaign";

export class CreateMessageCampaignController {
  constructor(
    private createMessageCampaignUseCase: CreateMessageCampaignUseCase,
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const userId = request.user?.id;
      const body = request.body as any;
      const data = body as MessageCampaignDTO;

      if (typeof body.scheduledAt === "string") {
        body.scheduledAt = new Date(body.scheduledAt);
      }

      if (
        body.scheduledAt instanceof Date &&
        Number.isNaN(body.scheduledAt.getTime())
      ) {
        throw new ApiError("scheduledAt inválido", 400);
      }

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      await this.createMessageCampaignUseCase.execute({
        ...data,
        userId,
      });

      response.status(201).send({ message: "Criado com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

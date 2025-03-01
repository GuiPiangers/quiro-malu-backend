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
      const data = request.body as MessageCampaignDTO;

      if (!userId) throw new ApiError("O id deve ser informado", 401);

      await this.createMessageCampaignUseCase.execute({
        userId,
        ...data,
      });

      response.status(201).send({ message: "Criado com sucesso!" });
    } catch (err: any) {
      return responseError(response, err);
    }
  }
}

import { Request, Response } from "express";
import { ApiError } from "../../../../utils/ApiError";
import { responseError } from "../../../../utils/ResponseError";
import type { GetUserProfileResponse } from "./getUserProfileSchemas";
import { GetUserProfileUseCase } from "../../useCases/getUser/GetUserProfileUseCase";

export class GetUserProfileController {
  constructor(private readonly getUserProfileUseCase: GetUserProfileUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user.id;
      if (!userId?.trim()) {
        throw new ApiError("Acesso não autorizado", 401, "unauthorized");
      }

      const user = await this.getUserProfileUseCase.execute(userId);
      const { password: _password, ...profile } = user;

      const body: GetUserProfileResponse = profile;
      return response.status(200).json(body);
    } catch (err: unknown) {
      return responseError(response, err);
    }
  }
}

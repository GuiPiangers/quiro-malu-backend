import { Request, Response } from "express";
import { GetUserProfileUseCase } from "../../useCases/getUser/GetUserProfileUseCase";
import { responseError } from "../../../../utils/ResponseError";

export class GetUserProfileController {
    constructor(private getUserProfileUseCase: GetUserProfileUseCase) { }

    async handle(request: Request, response: Response) {

        try {
            const id = request.user.id

            const user = await this.getUserProfileUseCase.execute(id!)
            const { password: _, ...loggedUser } = user

            return response.json(loggedUser)
        } catch (err: any) {
            return responseError(response, err)
        }
    }
}
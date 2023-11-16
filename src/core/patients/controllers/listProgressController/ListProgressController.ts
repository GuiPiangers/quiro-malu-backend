import { ListProgressUseCase } from "../../useCases/listProgress/ListProgressUseCase";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class ListProgressController {
    constructor(private listProgressUseCase: ListProgressUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const { patientId } = request.params
            const userId = request.user.id

            if (!patientId) throw new ApiError('O patientId devem ser informados', 400)

            const progress = await this.listProgressUseCase.execute(patientId, userId!)
            response.status(200).json(progress)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}
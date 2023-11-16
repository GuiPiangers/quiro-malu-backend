import { SetProgressUseCase } from "../../useCases/setProgress/SetProgressUseCase";
import { Request, Response } from "express";
import { ProgressDTO } from "../../models/Progress";
import { responseError } from "../../../../utils/ResponseError";

export class SetProgressController {
    constructor(private setProgressUseCase: SetProgressUseCase) { }
    async handle(request: Request, response: Response) {
        try {
            const data = request.body as ProgressDTO
            const userId = request.user.id

            const progress = await this.setProgressUseCase.execute(data, userId!)
            response.status(201).json(progress)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}
import { GetQtdSchedulesByDay } from "../../useCases/getQtdSchedulesByDay/GetQtdSchedulesByDay";
import { Request, Response } from "express";
import { responseError } from "../../../../utils/ResponseError";
import { ApiError } from "../../../../utils/ApiError";

export class GetQtdSchedulesByDayController {
    constructor(private getQtdSchedulesUseCase: GetQtdSchedulesByDay) { }
    async handle(request: Request, response: Response) {
        try {
            const { month, year } = request.query
            const userId = request.user.id

            if (!month || !year) throw new ApiError('Deve ser informado month e year ', 400)

            const qtdSchedules = await this.getQtdSchedulesUseCase.execute({ month: +month, year: +year, userId: userId! })
            response.status(200).json(qtdSchedules)
        }
        catch (err: any) {
            return responseError(response, err)
        }
    }
}
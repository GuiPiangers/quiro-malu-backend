import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { GetQtdSchedulesByDay } from "../../useCases/getQtdSchedulesByDay/GetQtdSchedulesByDay";
import { GetQtdSchedulesByDayController } from "./GetQtdSchedulesByDayController";

const schedulingRepository = new KnexSchedulingRepository()
const qtdSchedulesUseCase = new GetQtdSchedulesByDay(schedulingRepository)
const qtdSchedulesController = new GetQtdSchedulesByDayController(qtdSchedulesUseCase)

export { qtdSchedulesController }
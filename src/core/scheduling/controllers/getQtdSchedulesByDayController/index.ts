import { GetQtdSchedulesByDay } from "../../useCases/getQtdSchedulesByDay/GetQtdSchedulesByDay";
import { GetQtdSchedulesByDayController } from "./GetQtdSchedulesByDayController";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";

const schedulingRepository = knexSchedulingRepository
const qtdSchedulesUseCase = new GetQtdSchedulesByDay(schedulingRepository)
const qtdSchedulesController = new GetQtdSchedulesByDayController(qtdSchedulesUseCase)

export { qtdSchedulesController }
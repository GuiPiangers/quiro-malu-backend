import { MySqlSchedulingRepository } from "../../../../repositories/scheduling/MySqlSchedulingRepository";
import { GetQtdSchedulesByDay } from "../../useCases/getQtdSchedulesByDay/GetQtdSchedulesByDay";
import { GetQtdSchedulesByDayController } from "./GetQtdSchedulesByDayController";

const schedulingRepository = new MySqlSchedulingRepository()
const qtdSchedulesUseCase = new GetQtdSchedulesByDay(schedulingRepository)
const qtdSchedulesController = new GetQtdSchedulesByDayController(qtdSchedulesUseCase)

export { qtdSchedulesController }
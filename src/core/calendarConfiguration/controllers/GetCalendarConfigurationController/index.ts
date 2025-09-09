import { MongooseCalendarConfigurationRepository } from "../../../../repositories/calendarConfiguration/MongooseCalendarConfigurationRepository";
import { GetCalendarConfigurationUseCase } from "../../useCases/getCalendarConfiguration/GetCalendarConfiguration";
import { GetCalendarConfigurationController } from "./GetCalendarConfigurationController";

const calendarConfigurationRepository =
  new MongooseCalendarConfigurationRepository();
const getCalendarConfigurationUseCase = new GetCalendarConfigurationUseCase(
  calendarConfigurationRepository,
);
const getCalendarConfigurationController =
  new GetCalendarConfigurationController(getCalendarConfigurationUseCase);

export { getCalendarConfigurationController };

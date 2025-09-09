import { MongooseCalendarConfigurationRepository } from "../../../../repositories/calendarConfiguration/MongooseCalendarConfigurationRepository";
import { SaveCalendarConfigurationUseCase } from "../../useCases/SaveCalendarConfiguration";
import { SaveCalendarConfigurationController } from "./SaveCalendarConfigurationController";

const calendarConfigurationRepository =
  new MongooseCalendarConfigurationRepository();
const saveCalendarConfigurationUseCase = new SaveCalendarConfigurationUseCase(
  calendarConfigurationRepository,
);
const saveCalendarConfigurationController =
  new SaveCalendarConfigurationController(saveCalendarConfigurationUseCase);

export { saveCalendarConfigurationController };

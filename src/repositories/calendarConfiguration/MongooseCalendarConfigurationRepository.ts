import { CalendarConfiguration } from "../../core/calendarConfiguration/models/CalendarConfiguration";
import { CalendarConfigurationModel } from "../../database/mongoose/schemas/calendarConfiguration";
import {
  GetCalendarConfiguration,
  ICalendarConfigurationRepository,
  SaveCalendarConfiguration,
  UpdateCalendarConfiguration,
} from "./ICalendarConfigurationRepository";

export class MongooseCalendarConfigurationRepository
  implements ICalendarConfigurationRepository
{
  async get({
    userId,
  }: GetCalendarConfiguration): Promise<CalendarConfiguration | null> {
    const configDoc = await CalendarConfigurationModel.findOne({
      userId,
    }).lean();

    if (!configDoc) {
      return null;
    }

    const doc = configDoc as any;

    return new CalendarConfiguration({
      userId: doc.userId,
      0: doc[0],
      1: doc[1],
      2: doc[2],
      3: doc[3],
      4: doc[4],
      5: doc[5],
      6: doc[6],
    });
  }

  async save({
    calendarConfiguration,
  }: SaveCalendarConfiguration): Promise<void> {
    const dto = calendarConfiguration.getDTO();
    await CalendarConfigurationModel.create(dto);
  }

  async update({
    calendarConfiguration,
  }: UpdateCalendarConfiguration): Promise<void> {
    const { userId, ...dataToUpdate } = calendarConfiguration.getDTO();
    await CalendarConfigurationModel.updateOne(
      { userId },
      { $set: dataToUpdate },
    );
  }
}

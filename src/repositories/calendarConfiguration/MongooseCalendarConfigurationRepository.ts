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

    return new CalendarConfiguration({
      userId: configDoc.userId,
      domingo: configDoc.domingo || undefined,
      segunda: configDoc.segunda || undefined,
      terca: configDoc.terca || undefined,
      quarta: configDoc.quarta || undefined,
      quinta: configDoc.quinta || undefined,
      sexta: configDoc.sexta || undefined,
      sabado: configDoc.sabado || undefined,
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

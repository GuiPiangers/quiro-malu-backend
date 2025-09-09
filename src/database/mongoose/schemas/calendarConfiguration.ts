import mongoose from "mongoose";

const workScheduleSchema = new mongoose.Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false },
);

const dayConfigurationSchema = new mongoose.Schema(
  {
    workTimeIncrementInMinutes: { type: Number, required: true },
    workSchedules: [workScheduleSchema],
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const calendarConfigurationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  domingo: dayConfigurationSchema,
  segunda: dayConfigurationSchema,
  terca: dayConfigurationSchema,
  quarta: dayConfigurationSchema,
  quinta: dayConfigurationSchema,
  sexta: dayConfigurationSchema,
  sabado: dayConfigurationSchema,
});

export const CalendarConfigurationModel = mongoose.model(
  "CalendarConfiguration",
  calendarConfigurationSchema,
);

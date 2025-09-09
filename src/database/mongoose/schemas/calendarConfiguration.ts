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
  0: dayConfigurationSchema, // Monday
  1: dayConfigurationSchema, // Tuesday
  2: dayConfigurationSchema, // Wednesday
  3: dayConfigurationSchema, // Thursday
  4: dayConfigurationSchema, // Friday
  5: dayConfigurationSchema, // Saturday
  6: dayConfigurationSchema, // Sunday
});

export const CalendarConfigurationModel = mongoose.model(
  "CalendarConfiguration",
  calendarConfigurationSchema,
);

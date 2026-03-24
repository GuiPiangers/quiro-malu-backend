import mongoose from "mongoose";

const BirthdayMessageConfigSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "birthday_config" },
    campaignId: { type: String, required: true, index: true },
    sendHour: { type: Number, required: true, min: 0, max: 23 },
    sendMinute: { type: Number, required: true, min: 0, max: 59 },
  },
  { timestamps: true },
);

export const BirthdayMessageConfigModel = mongoose.model(
  "BirthdayMessageConfig",
  BirthdayMessageConfigSchema,
);

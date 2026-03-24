import mongoose from "mongoose";

const MessageLogSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, index: true },
    patientPhone: { type: String, required: true },
    campaignId: { type: String, required: true, index: true },
    origin: {
      type: String,
      enum: ["BIRTHDAY", "APPOINTMENT_REMINDER", "CAMPAIGN"],
      required: true,
    },
    schedulingId: { type: String },
    renderedBody: { type: String, required: true },
    status: { type: String, enum: ["SENT", "FAILED"], required: true },
    providerMessageId: { type: String },
    errorMessage: { type: String },
    sentAt: { type: Date },
  },
  { timestamps: true },
);

export const MessageLogModel = mongoose.model("MessageLog", MessageLogSchema);

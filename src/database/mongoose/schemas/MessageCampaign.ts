import mongoose, { Schema } from "mongoose";

const messageCampaignSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  templateMessage: { type: String, required: true },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  active: { type: Boolean, default: true },
  initialDate: Date,
  endDate: Date,
  triggers: [{ event: String, config: Schema.Types.Mixed }],

  audienceType: { type: String },
  audienceLimit: { type: Number },
  audienceOffsetMinutes: { type: Number },
  audiencePatientIds: { type: String },

  status: { type: String, default: "DRAFT", index: true },
  scheduledAt: { type: Date, index: true },
  lastDispatchAt: { type: Date },
  lastDispatchCount: { type: Number },
});

export const MessageCampaignModel = mongoose.model(
  "MessageCampaign",
  messageCampaignSchema,
);

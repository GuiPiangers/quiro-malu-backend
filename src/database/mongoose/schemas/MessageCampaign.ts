import mongoose from "mongoose";

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
});

export const MessageCampaignModel = mongoose.model(
  "MessageCampaign",
  messageCampaignSchema,
);

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  title: String,
  type: String,
  message: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  read: {
    type: Boolean,
    default: false,
  },
});

export const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema,
);

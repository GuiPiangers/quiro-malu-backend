import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  subscriptions: [
    {
      endpoint: String,
      keys: {
        p256dh: String,
        auth: String,
      },
      expirationTime: Number,
    },
  ],
});

export const SubscriptionModel = mongoose.model(
  "Subscription",
  subscriptionSchema,
);

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["booking_cancelled", "booking_confirmed", "general"],
      default: "general",
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;

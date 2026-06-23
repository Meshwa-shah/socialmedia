// models/notification.model.js

import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "like",
          "comment",
          "follow",
          "story_like",
          "story_tag",
          "mood_reaction"
        ],
        required: true,
      },

      post: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },

      status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
      },

      mood: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Mood"
      },

      isRead: {
        type: Boolean,
        default: false,
      },

      commentText: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;
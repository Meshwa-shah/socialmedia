import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default: "",
    },

    public_id: {
      type: String,
      default: ""
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    lastReminderSent: {
      type: Date,
      default: null,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    fcmToken: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }

);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;
import mongoose from "mongoose";

const moodSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      mood: String,
      emoji: String,
      note: String,

      isActive: {
        type: Boolean,
        default: true
      },
      

      reactions: [
        {
          user: {
            type:
              mongoose.Schema.Types.ObjectId,
            ref: "User"
          },

          type: {
            type: String
          }
        }
      ],

      expiresAt: {
        type: Date,
        default: () =>
          new Date(
            Date.now() +
            24 * 60 * 60 * 1000
          ),
        index: {
          expires: 0
        }
      }
    },
    {
      timestamps: true
    }
  );
export default mongoose.model(
  "Mood",
  moodSchema
);
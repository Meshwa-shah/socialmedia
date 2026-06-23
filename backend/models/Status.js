import mongoose from "mongoose";

const statusSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      text: {
        type: String,
        default: "",
      },

      media: {
        url: {
          type: String,
          default: "",
        },

        mediaType: {
          type: String,
          enum: [
            "image",
            "video",
          ],
        },
      },

      textcolor: {
        type: String,
        default: "white"
      },

      likes: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      viewers: [
        {
          user: {
            type:
              mongoose.Schema.Types.ObjectId,
            ref: "User",
          },

          viewedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

      expiresAt: {
        type: Date,
        required: true,
      },
      size:{
        type: Number,
        default:25
      },
      textPosition: {
        x: {
          type: Number,
          default: 50
        },
        y: {
          type: Number,
          default: 50
        }
      },
      taggedUsers: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

      ]
    },
    {
      timestamps: true,
    }
  );

statusSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Status = mongoose.model(
  "Status",
  statusSchema
);

export default Status;
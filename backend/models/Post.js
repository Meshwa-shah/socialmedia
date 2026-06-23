import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    media: [
      {
        url: String,
        public_id: String,
        mediaType: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],

    
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        user: {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        text: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model(
  "Post",
  postSchema
);

export default Post;
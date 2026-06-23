import Post from "../models/Post.js";
import User from "../models/Users.js";
import cloudinary from "../config/cloudinary.js";
import { getIO } from "../socket/socket.js";
import Notification from "../models/Notification.js";

export const createPost = async (
  req,
  res
) => {
  try {

    const userId = req.user;

    const { caption } = req.body;

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.json({
        success: false,
        message: "Media required",
      });
    }

    const uploadedMedia = [];

    for (const file of req.files) {

      const result =
        await cloudinary.uploader.upload(
          file.path,
          {
            resource_type: "auto",
            folder: "social_posts",
          }
        );

      uploadedMedia.push({
        url: result.secure_url,
        public_id: result.public_id,
        mediaType:
          result.resource_type === "video"
            ? "video"
            : "image",
      });
    }

    const post = await Post.create({
      user: userId,
      caption,
      media: uploadedMedia,
    });

    return res.status(201).json({
      success: true,
      post,
      message: "Post uploaded",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
export const getFeedPosts =
  async (req, res) => {

    try {

      const userId =
        req.user;

      const currentUser =
        await User.findById(
          userId
        );

      const posts =
        await Post.find({
          user: {
            $in:
              currentUser.following
          }
        })
          .populate(
            "user",
            "_id username profilePic"
          )
          .sort({
            createdAt: -1
          });

      return res.status(200).json({
        success: true,
        posts
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Server Error"
      });

    }

  };
  
export const toggleLikePost = async (
  req,
  res
) => {
  try {

    const userId = req.user;

    const { postId } = req.params;

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const io = getIO();

    // already liked?
    const alreadyLiked =
      post.likes.includes(userId);

    if (alreadyLiked) {

      // unlike
      post.likes =
        post.likes.filter(
          (id) =>
            id.toString() !==
            userId.toString()
        );

      await Notification.findOneAndDelete({
        sender: userId,
        recipient: post.user,
        post: post._id,
        type: "like",
      });

    } else {

      // like
      post.likes.push(userId);
      if (
        post.user.toString() !==
        userId.toString()
      ) {

        const notification = await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "like",
          post: post._id,
        });
        io.to(post.user.toString()).emit(
          "new_notification",
          notification
        );
      }
    }

    await post.save();


    io.emit("post_liked", {
      postId,
      likesCount: post.likes.length,
      likedBy: userId,
    });



    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      postId,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const deletePost = async (
  req,
  res
) => {

  try {

    const { postId } = req.params;

    const userId = req.user;

    const post =
      await Post.findById(postId);

    if (!post) {

      return res.status(404).json({
        success: false,
        message: "Post not found",
      });

    }

    if (
      post.user.toString() !==
      userId.toString()
    ) {

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });

    }

    await Post.findByIdAndDelete(
      postId
    );

    return res.status(200).json({
      success: true,
      message:
        "Post deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

export const addComment = async (
  req,
  res
) => {
  try {

    const userId = req.user;

    const { postId } =
      req.params;

    const { text } =
      req.body;

    if (!text?.trim()) {
      return res.json({
        success: false,
        message:
          "Comment cannot be empty",
      });
    }

    const post =
      await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const io = getIO();

    const comment = {
      user: userId,
      text,
    };

    post.comments.push(comment);

    await post.save();

    await post.populate(
      "comments.user",
      "username profilePic"
    );

    const newComment =
      post.comments[
        post.comments.length - 1
      ];

    if (
      post.user.toString() !==
      userId.toString()
    ) {

      const notification =
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "comment",
          post: post._id,
          commentText: text,
        });

      const populatedNotification =
        await Notification.findById(
          notification._id
        )
          .populate(
            "sender",
            "username profilePic"
          )
          .populate("post");

    
        io.to(post.user.toString())
        .emit(
          "new_notification",
          populatedNotification
        );
    }

    io.emit(
      "new_comment",
      {
        postId,
        comment: newComment,
      }
    );

    return res.status(201).json({
      success: true,
      comment: newComment,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const getComments =
  async (req, res) => {
    try {

      const { postId } =
        req.params;

      const post =
        await Post.findById(
          postId
        ).populate(
          "comments.user",
          "username profilePic"
        );

      if (!post) {
        return res.status(404).json({
          success: false,
          message:
            "Post not found",
        });
      }

      return res.status(200).json({
        success: true,
        comments:
          post.comments,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }
};

export const deleteComment =
  async (req, res) => {
    try {

      const userId =
        req.user;

      const {
        postId,
        commentId,
      } = req.params;

      const post =
        await Post.findById(
          postId
        );

      if (!post) {
        return res.status(404).json({
          success: false,
          message:
            "Post not found",
        });
      }

      const comment =
        post.comments.id(
          commentId
        );

      if (!comment) {
        return res.status(404).json({
          success: false,
          message:
            "Comment not found",
        });
      }

      const isCommentOwner =
        comment.user.toString() ===
        userId.toString();

      const isPostOwner =
        post.user.toString() ===
        userId.toString();

      if (
        !isCommentOwner &&
        !isPostOwner
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      comment.deleteOne();
       await Notification.findOneAndDelete({
        sender: userId,
        recipient: post.user,
        post: post._id,
        type: "comment",
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message:
          "Comment deleted",
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }
};

export const getSinglePost = async (
  req,
  res
) => {

  try {

    const { postId } =
      req.params;

    const post =
      await Post.findById(postId)

        .populate(
          "user",
          "username profilePic"
        )

        .populate(
          "comments.user",
          "username profilePic"
        );

    if (!post) {

      return res.status(404).json({
        success: false,
        message: "Post not found",
      });

    }

    return res.status(200).json({
      success: true,
      post: [post],
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

export const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "likes",
      "username profilePic fullname"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      likes: post.likes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getLikedPosts =
  async (req, res) => {

    try {

      const posts =
        await Post.find({
          likes: req.user
        }) .populate(
            "user",
            "username profilePic"
          ).populate(
            "likes",
            "username profilePic"
          ).sort({
           createdAt: -1
          });

      return res.status(200).json({
        success: true,
        posts
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };
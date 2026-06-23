import User from "../models/Users.js";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";

export const getMyProfile =
  async (req, res) => {

    try {

      const { userId } = req.params;

      const user =
        await User.findById(userId)
          .select("-password")
          .populate(
            "followers",
            "username profilePic"
          )
          .populate(
            "following",
            "username profilePic"
          );

      const posts =
        await Post.find({
          user: userId,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        user,
        posts,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }

  };

export const editProfile =
  async (req, res) => {

    try {

      const userId = req.user;

      const {
        username,
        bio
      } = req.body;

      const updateData = {};

      // only update if provided
      if (username) {
        updateData.username =
          username;
      }

      if (bio) {
        updateData.bio =
          bio;
      }

      // profile picture optional
      if (req.file) {

        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              folder:
                "profile_pictures"
            }
          );

        updateData.profilePic =
          result.secure_url;

        updateData.public_id =
          result.public_id;

      }

      const user =
        await User.findByIdAndUpdate(
          userId,
          {
            $set: updateData
          },
          {
            new: true
          }
        ).select("-password");

      return res.status(200).json({
        success: true,
        user
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };

export const searchUsers =
  async (req, res) => {

    try {

      const { q } =
        req.query;

      const users =
        await User.find({
          username: {
            $regex: q,
            $options: "i",
          },
        })
          .select(
            "username profilePic"
          )
          .limit(20);

      return res.status(200).json({
        success: true,
        users,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };


export const toggleFollowUser =
  async (req, res) => {

    try {

      const currentUserId =
        req.user;

      const { userId } =
        req.params;

      if (
        currentUserId === userId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot follow yourself",
        });
      }

      const currentUser =
        await User.findById(
          currentUserId
        );

      const targetUser =
        await User.findById(
          userId
        );

      if (!targetUser) {

        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });

      }

      const isFollowing =
        currentUser.following.includes(
          userId
        );

      // UNFOLLOW

      if (isFollowing) {

        currentUser.following =
          currentUser.following.filter(
            (id) =>
              id.toString() !==
              userId
          );

        targetUser.followers =
          targetUser.followers.filter(
            (id) =>
              id.toString() !==
              currentUserId
          );

        await currentUser.save();
        await targetUser.save();

        await Notification.findOneAndDelete({
          recipient: userId,
          sender: currentUserId,
          type: "follow",
        });

        return res.status(200).json({
          success: true,
          following: false,
          message:
            "User unfollowed",
        });

      }

      // FOLLOW

      currentUser.following.push(
        userId
      );

      targetUser.followers.push(
        currentUserId
      );

      await currentUser.save();
      await targetUser.save();

      // Notification

      const notification =
        await Notification.create({
          recipient: userId,
          sender: currentUserId,
          type: "follow",
        });

      const populatedNotification =
        await Notification.findById(
          notification._id
        ).populate(
          "sender",
          "username profilePic"
        );

      const io = getIO();

      io.to(userId).emit(
        "new_notification",
        populatedNotification
      );

      return res.status(200).json({
        success: true,
        following: true,
        message:
          "User followed",
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Server Error",
      });

    }

  };

  export const getFollowers =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const user =
        await User.findById(
          userId
        ).populate(
          "followers",
          "username profilePic"
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });

      }

      return res.status(200).json({
        success: true,
        followers:
          user.followers
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };

  export const getFollowing =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const user =
        await User.findById(
          userId
        ).populate(
          "following",
          "username profilePic"
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });

      }

      return res.status(200).json({
        success: true,
        following:
          user.following
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };

  export const saveFcmToken =
  async (req, res) => {

    const { token } =
      req.body;

    await User.findByIdAndUpdate(
      req.user,
      {
        fcmToken: token
      }
    );

    res.json({
      success: true
    });

  };
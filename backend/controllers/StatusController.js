import User from "../models/Users.js";
import Status from "../models/Status.js";
import cloudinary from "../config/cloudinary.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";

export const createStatus =
  async (req, res) => {

    try {

      const userId =
        req.user;

      const { text, taggedUsers, textcolor} =
        req.body;

      let media = {};

      if (req.file) {

        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              resource_type:
                "auto",
              folder:
                "statuses",
            }
          );

        media = {
          url:
            result.secure_url,

          mediaType:
            result.resource_type ===
              "video"
              ? "video"
              : "image",
        };

      }

      const textPosition =
        req.body.textPosition
          ? JSON.parse(
            req.body.textPosition
          )
          : {
            x: 50,
            y: 50
          };

      if (
        !text &&
        !media.url
      ) {

        return res.json({
          success: false,
          message:
            "Status cannot be empty",
        });

      }

      const io = getIO();

      const parsedTaggedUsers =
        taggedUsers
          ? JSON.parse(
            taggedUsers
          )
          : [];

      const status =
        await Status.create({
          user: userId,
          text,
          media,

          expiresAt:
            new Date(
              Date.now() +
              24 *
              60 *
              60 *
              1000
            ),

          taggedUsers:
            parsedTaggedUsers,
          textPosition: textPosition, 
          textcolor: textcolor
        });

      for (
        const taggedUserId
        of parsedTaggedUsers
      ) {

        if (
          taggedUserId.toString() !==
          req.user.toString()
        ) {

          const notification =
            await Notification.create({

              recipient:
                taggedUserId,

              sender:
                req.user,

              type:
                "story_tag",

              status:
                status._id,

            });

          io.to(
            taggedUserId.toString()
          ).emit(
            "new_notification",
            notification
          );

        }

      }

      return res.status(201).json({
        success: true,
        status,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };

export const getStatuses =
  async (req, res) => {

    try {

      const currentUser =
        await User.findById(
          req.user
        );

      const users = [
        currentUser._id,
        ...currentUser.following,
      ];

      const statuses =
        await Status.find({
          user: {
            $in: users,
          },
        })
          .populate(
            "user",
            "username profilePic"
          )
          .populate(
            "taggedUsers",
            "username profilePic"
          )
          .populate("viewers")
          .populate("likes")
          .sort({
            createdAt: 1,
          });

      const grouped =
        statuses.reduce(
          (acc, status) => {

            const userId =
              status.user._id.toString();

            if (
              !acc[userId]
            ) {

              acc[userId] = {

                user:
                  status.user,

                statuses: [],
              };

            }

            acc[userId]
              .statuses
              .push(status);

            return acc;

          },
          {}
        );

      const stories =
        Object.values(
          grouped
        );

      stories.sort(
        (a, b) => {

          if (
            a.user._id.toString() ===
            req.user.toString()
          )
            return -1;

          if (
            b.user._id.toString() ===
            req.user.toString()
          )
            return 1;

          return 0;

        }
      );

      return res.status(200).json({
        success: true,
        stories,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };

export const toggleLikeStatus =
  async (req, res) => {

    try {

      const userId =
        req.user;

      const { statusId } =
        req.params;

      const status =
        await Status.findById(
          statusId
        );

      if (!status) {

        return res.status(404).json({
          success: false,
        });

      }
      const io = getIO();

      const alreadyLiked =
        status.likes.includes(
          userId
        );

      if (
        alreadyLiked
      ) {

        status.likes =
          status.likes.filter(
            (id) =>
              id.toString() !==
              userId.toString()
          );
        await Notification.findOneAndDelete({

          recipient:
            status.user,

          sender:
            userId,

          type:
            "story_like",

          status:
            status._id,

        });

      } else {

        status.likes.push(
          userId
        );
        if (
          status.user.toString() !==
          userId.toString()
        ) {

          const notification =
            await Notification.create({

              recipient:
                status.user,

              sender:
                userId,

              type:
                "story_like",

              status:
                status._id,

            });

          const populatedNotification =
            await Notification.findById(
              notification._id
            )

              .populate(
                "sender",
                "username profilePic"
              )

              .populate(
                "status"
              );
          io.to(
            status.user.toString()
          ).emit(
            "new_notification",
            populatedNotification
          );
        }

      }

      await status.save();

      return res.status(200).json({
        success: true,
        likes:
          status.likes.length,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };

export const viewStatus =
  async (req, res) => {

    try {

      const userId =
        req.user;

      const { statusId } =
        req.params;

      const status =
        await Status.findById(
          statusId
        );

      if (!status) {

        return res.status(404).json({
          success: false,
        });

      }

      const alreadyViewed =
        status.viewers.some(
          (viewer) =>
            viewer.user.toString() ===
            userId.toString()
        );

      if (
        !alreadyViewed
      ) {

        status.viewers.push({
          user: userId,
        });

        await status.save();

      }

      return res.status(200).json({
        success: true,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };

export const deleteStatus =
  async (req, res) => {

    try {

      const userId =
        req.user;

      const { statusId } =
        req.params;

      const status =
        await Status.findById(
          statusId
        );

      if (!status) {

        return res.status(404).json({
          success: false,
        });

      }

      if (
        status.user.toString() !==
        userId.toString()
      ) {

        return res.status(403).json({
          success: false,
        });

      }

      await Status.findByIdAndDelete(
        statusId
      );

      return res.status(200).json({
        success: true,
        message:
          "Status deleted",
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };

export const getUserStories =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const statuses =
        await Status.find({
          user: userId,
        }).populate(
          "user",
          "username profilePic"
        )
          .populate(
            "taggedUsers",
            "username profilePic"
          )
          .populate("likes")
          .sort({
            createdAt: 1,
          });

      if (statuses.length === 0) {
        return res.status(200).json({
          success: false,
          message: "story no longer exists"
        })
      }

      return res.status(200).json({
        success: true,
        statuses,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
      });

    }

  };

export const getStoryLikes = async (
  req,
  res
) => {
  try {
    const { storyId } = req.params;

    const story = await Status.findById(
      storyId
    )
      .select("likes")
      .populate(
        "likes",
        "username profilePic fullname"
      );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(200).json({
      success: true,
      likes: story.likes,
      totalLikes: story.likes.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getStoryViewers = async (
  req,
  res
) => {
  try {
    const { storyId } = req.params;

    const story = await Status.findById(
      storyId
    ).populate(
      "viewers.user",
      "username profilePic fullname"
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(200).json({
      success: true,
      viewers: story.viewers,
      totalViews: story.viewers.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getStoryById =
  async (req, res) => {

    try {

      const { storyId } =
        req.params;

      const story =
        await Status.findById(
          storyId
        )
          .populate(
            "user",
            "username profilePic"
          )
          .populate(
            "taggedUsers",
            "username profilePic"
          )
          .populate("likes");

      if (!story) {

        return res.status(404).json({
          success: false,
          message:
            "Story not found"
        });

      }

      return res.status(200).json({
        success: true,
        story
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };
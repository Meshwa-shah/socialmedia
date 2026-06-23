import Mood from "../models/Mood.js";
import User from "../models/Users.js";
import Notification from "../models/Notification.js";
import { getIO, users } from "../socket/socket.js";
// CREATE MOOD

export const createMood =
  async (req, res) => {

    try {

      const {
        mood,
        emoji,
        note
      } = req.body;

      // deactivate old mood
      await Mood.updateMany(
        {
          user: req.user,
          isActive: true
        },
        {
          isActive: false
        }
      );

      const newMood =
        await Mood.create({
          user: req.user,
          mood,
          emoji,
          note
        });

      const populatedMood =
        await Mood.findById(
          newMood._id
        ).populate(
          "user",
          "username profilePic"
        );

      return res.status(201).json({
        success: true,
        mood: populatedMood
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };


// GET FEED

export const getMoodFeed =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user
        );

      const ids = [
        req.user,
        ...user.following
      ];

      const moods =
        await Mood.find({
          user: {
            $in: ids
          },
          isActive: true
        })

          .populate(
            "user",
            "username profilePic"
          )

          .populate(
            "reactions.user",
            "username profilePic"
          )

          .sort({
            createdAt: -1
          });

      return res.status(200).json({
        success: true,
        moods
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };


// REACT TO MOOD



export const reactToMood =
  async (req, res) => {

    try {

      const { moodId } =
        req.params;

      const { type } =
        req.body;

      const mood =
        await Mood.findById(
          moodId
        );

      if (!mood) {

        return res.status(404).json({
          success: false
        });

      }

      const alreadyReacted =
        mood.reactions.find(
          reaction =>
            reaction.user.toString() ===
            req.user.toString()
        );

      if (alreadyReacted) {

        alreadyReacted.type =
          type;

      } else {

        mood.reactions.push({
          user: req.user,
          type
        });

        // create notification only if not own mood
        if (
          mood.user.toString() !==
          req.user.toString()
        ) {

          const notification =
            await Notification.create({
              recipient:
                mood.user,
              sender:
                req.user,
              type: "mood_reaction",
              mood: mood._id
            });

          const populatedNotification =
            await Notification.findById(
              notification._id
            ).populate(
              "sender",
              "username profilePic"
            );

          const io =
            getIO();

          if (
            users[
              mood.user.toString()
            ]
          ) {

            io.to(
              users[
                mood.user.toString()
              ]
            ).emit(
              "new_notification",
              populatedNotification
            );

          }

        }

      }

      await mood.save();

      return res.status(200).json({
        success: true
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };


// GET MOOD HISTORY

export const getMoodHistory =
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const moods =
        await Mood.find({
          user: userId
        })

          .sort({
            createdAt: -1
          });

      return res.status(200).json({
        success: true,
        moods
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };

  export const getSingleMood =
  async (req, res) => {

    try {

      const { moodId } =
        req.params;

      const mood =
        await Mood.findById(
          moodId
        )

          .populate(
            "user",
            "username profilePic"
          )

          .populate(
            "reactions.user",
            "username profilePic"
          );

      if (!mood) {

        return res.status(404).json({
          success: false,
          message:
            "Mood not found"
        });

      }

      return res.status(200).json({
        success: true,
        mood: mood
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };

  export const getMoodReactions =
  async (req, res) => {

    try {

      const { moodId } =
        req.params;

      const mood =
        await Mood.findById(
          moodId
        )

          .populate(
            "reactions.user",
            "username profilePic"
          );

      if (!mood) {

        return res.status(404).json({
          success: false
        });

      }

      return res.status(200).json({
        success: true,
        reactions:
          mood.reactions
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false
      });

    }

  };
import cron from "node-cron";
import Mood from "../models/Mood.js";
import User from "../models/Users.js";
import { sendPush } from "./sendnotification.js";
import dotenv from 'dotenv';
dotenv.config();

cron.schedule(
  "0 */6 * * *",
  async () => {
    console.log("checking moods");

    const twoDaysAgo =
      new Date(
        Date.now() -
         48 * 60 * 60 * 1000
      );

    const users =
      await User.find();

    for (const user of users) {

      const latestMood =
        await Mood.findOne({
          user: user._id
        }).sort({
          createdAt: -1
        });

      if (
        !latestMood ||
        latestMood.createdAt <
        twoDaysAgo
      ) {

        await sendPush(
          user.fcmToken,
        "Update your mood 💛",
      ` Hey ${user.username}💛 `
        );

      }

    }

  }
);
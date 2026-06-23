import cron from "node-cron";

import User from "../models/Users.js";

import { sendPush } from "./sendnotification.js";
import dotenv from 'dotenv';

dotenv.config();

cron.schedule("0 */6 * * *", async () => {

  console.log("Checking inactive users");

  const oneDayAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  );

  const inactiveUsers = await User.find({
    lastSeen: { $lt: oneDayAgo },
  });

  for (const user of inactiveUsers) {

    // avoid spam
    if (
      user.lastReminderSent &&
      Date.now() -
        new Date(
          user.lastReminderSent
        ).getTime() <
        24 * 60 * 60 * 1000
    ) {
      continue;
    }

    await sendPush(
      user.fcmToken,
       "We miss you ❤️",
  ` Come back and check new posts and stories!`
    );

    user.lastReminderSent = new Date();

    await user.save();
  }
});


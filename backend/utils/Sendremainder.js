import cron from "node-cron";
import User from "../models/Users.js";
import { sendPush } from "./sendnotification.js";
import dotenv from "dotenv";

dotenv.config();

// FOR TESTING:
// runs every minute
// change to "0 11 * * *" for production

cron.schedule(
  "0 */8 * * *",
  async () => {

    try {

      console.log(
        "Checking inactive users..."
      );

      const oneDayAgo =
        new Date(
          Date.now() -
            24 *
              60 *
              60 *
              1000
        );

      // users inactive for 24h
      // OR users who never had lastSeen
      const inactiveUsers =
        await User.find({
          $or: [
            {
              lastSeen: null
            },
            {
              lastSeen: {
                $lt:
                  oneDayAgo
              }
            }
          ]
        });

      console.log(
        "Inactive users found:",
        inactiveUsers.length
      );

      for (const user of inactiveUsers) {

        try {

          // prevent sending more than once in 24h
          if (
            user.lastReminderSent &&
            Date.now() -
              new Date(
                user.lastReminderSent
              ).getTime() <
              24 *
                60 *
                60 *
                1000
          ) {

            console.log(
              `Skipping ${user.username} (already reminded)`
            );

            continue;

          }

          await sendPush(
            user.fcmToken,
            "We miss you ❤️",
            "Come back and check new posts!"
          );

          console.log(
            `notification sent to ${user.email}`
          );

          user.lastReminderSent =
            new Date();

          await user.save();

        } catch (error) {

          console.log(
            `Failed for ${user.email}:`,
            error.message
          );

        }

      }

    } catch (error) {

      console.log(
        "Cron failed:",
        error.message
      );

    }

  }, {
  timezone: "Asia/Kolkata"
}
);
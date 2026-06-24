import cron from "node-cron";
import User from "../models/Users.js";
import sendEmail from "../utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

// FOR TESTING:
// runs every minute
// change to "0 11 * * *" for production

cron.schedule(
  "0 11 * * *",
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

          await sendEmail(
            user.email,
            "We miss you ❤️",
            `
              <h2>We miss you ❤️</h2>
              <p>Come back and check new posts!</p>

              <a href="${process.env.front_url}"
                style="
                  display:inline-block;
                  padding:10px 20px;
                  background:#e1306c;
                  color:white;
                  text-decoration:none;
                  border-radius:5px;
                ">
                Open App
              </a>
            `
          );

          console.log(
            `Email sent to ${user.email}`
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

  }
);
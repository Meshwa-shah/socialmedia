import cron from "node-cron";

import User from "../models/Users.js";

import sendEmail from "../utils/sendEmail.js";
import dotenv from 'dotenv';

dotenv.config();

cron.schedule("0 */12 * * *", async () => {

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

    user.lastReminderSent = new Date();

    await user.save();
  }
});


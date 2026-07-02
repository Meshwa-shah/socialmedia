import cron from "node-cron";
import Mood from "../models/Mood.js";
import User from "../models/Users.js";
import sendEmail from "./sendEmail.js";
import dotenv from 'dotenv';
dotenv.config();

cron.schedule(
  "0 10 * * *",
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

        await sendEmail(
          user.email,
        "Update your mood 💛",
  `
    <h2>Hey ${user.username} 💛</h2>
    <p>Your family would love to know how you're feeling today.</p>

    <a href="${process.env.front_url}/mood"
       style="
         display:inline-block;
         padding:10px 20px;
         background:#facc15;
         color:black;
         text-decoration:none;
         border-radius:6px;
         font-weight:bold;
       ">
       Update Mood
    </a>
  `
        );

      }

    }

  }, {
  timezone: "Asia/Kolkata"
}
);
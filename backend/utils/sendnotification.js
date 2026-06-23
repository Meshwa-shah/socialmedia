import {
  getMessaging
} from "../firebaseAdmin.js";

export const sendPush =
  async (
    token,
    title,
    body
  ) => {

    if (!token) return;

    await getMessaging().send({
      token,
      notification: {
        title,
        body
      }
    });

  };
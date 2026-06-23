import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

let io;

export const users = {};
export const lastSeen = {};

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: process.env.front_url,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    console.log(
      "User connected:",
      socket.id
    );

    // USER JOINS
    socket.on(
      "join",
      (userId) => {

        // save socket
        users[userId] =
          socket.id;

        // create personal room
        socket.join(userId);

        console.log(
          "User joined:",
          userId
        );

        // remove old last seen
        delete lastSeen[userId];

        // send updated online users
        io.emit(
          "online_users",
          {
            onlineUsers:
              Object.keys(users),
            lastSeen
          }
        );

      }
    );

    // NOTIFICATIONS READ
    socket.on(
      "notifications_read",
      () => {

        socket.emit(
          "clear_notification_badge"
        );

      }
    );

    // MESSAGES READ
    socket.on(
      "messages_read",
      () => {

        socket.emit(
          "clear_message_badge"
        );

      }
    );

    // DISCONNECT
    socket.on(
      "disconnect",
      () => {

        console.log(
          "User disconnected:",
          socket.id
        );

        for (const id in users) {

          if (
            users[id] === socket.id
          ) {

            // save last seen
            lastSeen[id] =
              new Date();

            // remove user
            delete users[id];

            break;

          }

        }

        // update online users
        io.emit(
          "online_users",
          {
            onlineUsers:
              Object.keys(users),
            lastSeen
          }
        );

      }
    );

  });

  return io;

};

export const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.io not initialized"
    );

  }

  return io;

};
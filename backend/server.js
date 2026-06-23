import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import './cron/inactiveUsers.js'
import './utils/moodReminder.js'
import './utils/Moodnotification.js'
import './utils/Sendremainder.js'
import { initSocket } from "./socket/socket.js";

dotenv.config();
connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
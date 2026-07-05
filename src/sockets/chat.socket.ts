import { Server } from "socket.io";
import { Message } from "../models/Message";
import { verifyToken, JwtPayload } from "../utils/jwt";

type OnlineUser = JwtPayload & {
  socketId: string;
};

const onlineUsers = new Map<string, OnlineUser>();

function getOnlineUsers() {
  return Array.from(onlineUsers.values()).map((user) => ({
    userId: user.userId,
    username: user.username,
    email: user.email
  }));
}

export function registerChatSocket(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const user = verifyToken(token);
      socket.data.user = user;
      return next();
    } catch {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as JwtPayload;

    onlineUsers.set(user.userId, {
      ...user,
      socketId: socket.id
    });

    io.emit("online:users", getOnlineUsers());

    socket.broadcast.emit("user:joined", {
      userId: user.userId,
      username: user.username
    });

    socket.on("message:send", async (payload: { text: string }) => {
      const text = payload.text?.trim();

      if (!text || text.length > 1000) {
        return;
      }

      const message = await Message.create({
        sender: user.userId,
        text
      });

      const savedMessage = await message.populate("sender", "username email");

      io.emit("message:new", savedMessage);
    });

    socket.on("disconnect", () => {
      const current = onlineUsers.get(user.userId);

      if (current?.socketId === socket.id) {
        onlineUsers.delete(user.userId);
      }

      io.emit("online:users", getOnlineUsers());

      socket.broadcast.emit("user:left", {
        userId: user.userId,
        username: user.username
      });
    });
  });
}
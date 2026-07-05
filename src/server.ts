import http from "http";
import { Server } from "socket.io";
import { app } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { registerChatSocket } from "./sockets/chat.socket";

async function bootstrap() {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: env.frontendUrl,
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  registerChatSocket(io);

  server.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
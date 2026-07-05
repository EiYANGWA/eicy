import { Request, Response } from "express";
import { Message } from "../models/Message";

export async function getMessages(req: Request, res: Response) {
  const messages = await Message.find()
    .sort({ createdAt: 1 })
    .limit(100)
    .populate("sender", "username email");

  return res.json({ messages });
}
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(409).json({ message: "Username or email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    username,
    email,
    passwordHash
  });

  const token = signToken({
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  });

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken({
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  });

  return res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
}

export function me(req: Request, res: Response) {
  return res.json({ user: req.user });
}
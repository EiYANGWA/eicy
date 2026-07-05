import dotenv from "dotenv";

dotenv.config();

const required = [
  "FRONTEND_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "MONGO_USER",
  "MONGO_PASS",
  "MONGO_HOST",
  "MONGO_DB"
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT),
  frontendUrl: process.env.FRONTEND_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  mongoUser: process.env.MONGO_USER as string,
  mongoPass: process.env.MONGO_PASS as string,
  mongoHost: process.env.MONGO_HOST as string,
  mongoDb: process.env.MONGO_DB as string
};
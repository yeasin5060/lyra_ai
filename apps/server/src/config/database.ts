import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { env } from "./env.js";

export const mongoClient = new MongoClient(env.DATABASE_URL);

export async function connectDatabase() {
  try {
    await mongoClient.connect();
    await mongoose.connect(env.DATABASE_URL);
    console.log("LYRA MongoDB connected");
  } catch (error) {
    console.warn("⚠️ LYRA MongoDB not reachable yet. Server starting in degraded mode.");
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  await mongoClient.close();
}

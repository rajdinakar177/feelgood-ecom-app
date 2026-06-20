// dbConfig/db.ts
import mongoose from "mongoose";

const cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URL!);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
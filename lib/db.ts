import mongoose from "mongoose";

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cached = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = cached;
}

async function connectDB() {
  let mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

  if (!mongoUri) {
    throw new Error("Please define MONGODB_URI or MONGODB_URL in your environment variables");
  }

  // Strip single/double quotes and whitespace if present in .env
  mongoUri = mongoUri.replace(/^['"]|['"]$/g, "").trim();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;

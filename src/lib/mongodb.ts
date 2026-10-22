import { MongoClient, Db } from "mongodb";

const configuredUri = process.env.MONGODB_URI?.trim();
const hasConfiguredMongoUri = Boolean(
  configuredUri &&
    configuredUri !== "your-mongodb-uri" &&
    configuredUri !== "your-mongodb-connection-string"
);
const uri = configuredUri || "mongodb://localhost:27017/budivada_sarpanch";
const dbName = process.env.MONGODB_DB || "budivada_sarpanch";

export const MONGODB_COLLECTIONS = {
  FEEDBACK: "public_feedback",
  FOLLOWUPS: "followup_requests",
  OPINIONS: "anonymous_opinions",
  POST_VOTE_DETAILS: "post_vote_details",
  POLLS: "admin_polls",
  CONTENT: "site_content",
  LOGS: "audit_logs",
} as const;

let lastMongoConnectionError: string | null = null;

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getMongoClientPromise(): Promise<MongoClient> | null {
  if (!uri || uri === "your-mongodb-uri") return null;
  if (globalWithMongo._mongoClientPromise) return globalWithMongo._mongoClientPromise;

  const mongoClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 5000,
  });
  const connectionPromise = mongoClient.connect().catch(async (err: unknown) => {
    lastMongoConnectionError = err instanceof Error ? err.message : "Unknown connection error";
    console.warn("[MongoDB] Connection failed:", lastMongoConnectionError);
    delete globalWithMongo._mongoClientPromise;
    await mongoClient.close().catch(() => undefined);
    throw err;
  });
  globalWithMongo._mongoClientPromise = connectionPromise;
  return connectionPromise;
}

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  const clientPromise = getMongoClientPromise();
  if (!clientPromise) {
    return { client: null, db: null };
  }
  try {
    const connectedClient = await clientPromise;
    // Check if connected
    const db = connectedClient.db(dbName);
    // Ping to verify active connection
    await db.command({ ping: 1 });
    lastMongoConnectionError = null;
    return { client: connectedClient, db };
  } catch (err) {
    lastMongoConnectionError = err instanceof Error ? err.message : "Unknown connection error";
    if (globalWithMongo._mongoClientPromise === clientPromise) {
      delete globalWithMongo._mongoClientPromise;
    }
    const connectedClient = await clientPromise.catch(() => null);
    await connectedClient?.close().catch(() => undefined);
    return { client: null, db: null };
  }
}

export async function getMongoDb(): Promise<Db | null> {
  const { db } = await connectToDatabase();
  if (!db && (process.env.NODE_ENV === "production" || hasConfiguredMongoUri)) {
    const details =
      process.env.NODE_ENV !== "production" && lastMongoConnectionError
        ? ` ${lastMongoConnectionError.replace(/mongodb(?:\+srv)?:\/\/[^\s"'`]+/gi, "mongodb://[redacted]")}`
        : "";
    throw new Error(
      `MongoDB is unavailable. Check MONGODB_URI, Atlas Network Access, and the database user's credentials.${details}`
    );
  }
  return db;
}

export function isMongoActive(): boolean {
  return globalWithMongo._mongoClientPromise !== undefined;
}

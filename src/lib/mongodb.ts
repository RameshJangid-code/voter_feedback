import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/budivada_sarpanch";
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

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (uri && uri !== "your-mongodb-uri") {
  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 3000,
      });
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        console.warn("[MongoDB] Local/remote connection note:", err?.message || "Unavailable");
        return client as MongoClient;
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 3000,
    });
    clientPromise = client.connect().catch((err) => {
      console.warn("[MongoDB] Production connection note:", err?.message);
      return client as MongoClient;
    });
  }
}

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  if (!clientPromise) {
    return { client: null, db: null };
  }
  try {
    const connectedClient = await clientPromise;
    // Check if connected
    const db = connectedClient.db(dbName);
    // Ping to verify active connection
    await db.command({ ping: 1 });
    return { client: connectedClient, db };
  } catch (_err) {
    return { client: null, db: null };
  }

}

export async function getMongoDb(): Promise<Db | null> {
  const { db } = await connectToDatabase();
  return db;
}

export function isMongoActive(): boolean {
  return clientPromise !== null;
}

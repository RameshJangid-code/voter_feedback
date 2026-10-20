import { NextResponse } from "next/server";
import { getMongoDb, MONGODB_COLLECTIONS } from "@/lib/mongodb";
import { ensureMongoSeeded } from "@/lib/mongoService";

export async function GET() {
  try {
    await ensureMongoSeeded();
    const db = await getMongoDb();

    if (!db) {
      return NextResponse.json({
        connected: false,
        engine: "Fallback Storage Engine",
        message: "MongoDB connection initializing or offline.",
      });
    }

    const [
      feedbackCount,
      followupsCount,
      opinionsCount,
      votersCount,
      pollsCount,
      contentCount,
    ] = await Promise.all([
      db.collection(MONGODB_COLLECTIONS.FEEDBACK).countDocuments(),
      db.collection(MONGODB_COLLECTIONS.FOLLOWUPS).countDocuments(),
      db.collection(MONGODB_COLLECTIONS.OPINIONS).countDocuments(),
      db.collection(MONGODB_COLLECTIONS.POST_VOTE_DETAILS).countDocuments(),
      db.collection(MONGODB_COLLECTIONS.POLLS).countDocuments(),
      db.collection(MONGODB_COLLECTIONS.CONTENT).countDocuments(),
    ]);

    return NextResponse.json({
      connected: true,
      database: db.databaseName,
      collections: {
        public_feedback: feedbackCount,
        followup_requests: followupsCount,
        anonymous_opinions: opinionsCount,
        post_vote_details: votersCount,
        admin_polls: pollsCount,
        site_content: contentCount,
      },
      message: "MongoDB connection active and storing real Budivada village data.",
    });
  } catch (err: any) {
    console.error("Error in /api/db-status:", err);
    return NextResponse.json({
      connected: false,
      error: err?.message,
    });
  }
}

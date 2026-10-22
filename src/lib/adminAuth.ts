import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

function getAdminApp() {
  const existingApp = getApps().find((app) => app.name === "voter-app-admin");
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const credential = serviceAccount
    ? cert(JSON.parse(serviceAccount))
    : applicationDefault();

  return initializeApp(
    {
      credential,
      ...(projectId ? { projectId } : {}),
    },
    "voter-app-admin"
  );
}

export interface AdminIdentity {
  uid: string;
  email: string;
  role: "superadmin" | "admin" | "moderator";
}

export async function requireAdmin(
  request: NextRequest
): Promise<AdminIdentity | NextResponse> {
  const localHost = ["localhost", "127.0.0.1", "::1"].includes(request.nextUrl.hostname);
  if (
    process.env.NODE_ENV !== "production" &&
    localHost &&
    request.headers.get("x-local-demo-admin") === "true"
  ) {
    return {
      uid: "local-demo-admin",
      email: "admin@janawaaz.in",
      role: "superadmin",
    };
  }

  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  let app;
  try {
    app = getAdminApp();
  } catch (error) {
    console.error("Admin API authentication failed:", error);
    return NextResponse.json(
      { error: "Unable to verify admin credentials. Check Firebase Admin configuration." },
      { status: 503 }
    );
  }

  let decodedToken;
  try {
    decodedToken = await getAuth(app).verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid or expired admin credentials" }, { status: 401 });
  }

  if (!decodedToken.email) {
    return NextResponse.json({ error: "Admin account required" }, { status: 403 });
  }

  try {
    const adminDocument = await getFirestore(app)
      .collection("admins")
      .doc(decodedToken.uid)
      .get();
    const role = adminDocument.data()?.role;
    if (!adminDocument.exists || !["superadmin", "admin", "moderator"].includes(role)) {
      return NextResponse.json({ error: "Admin account required" }, { status: 403 });
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role,
    };
  } catch (error) {
    console.error("Admin role lookup failed:", error);
    const details =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? `: ${error.message}`
        : "";
    return NextResponse.json(
      { error: `Unable to verify administrator role${details}` },
      { status: 503 }
    );
  }
}

export function isAdminIdentity(identity: AdminIdentity | NextResponse): identity is AdminIdentity {
  return !(identity instanceof NextResponse);
}

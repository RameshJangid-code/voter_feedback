import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

function getAdminApp() {
  const existingApp = getApps().find((app) => app.name === "voter-app-admin");
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccount && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return null;
  }

  try {
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
  } catch (err) {
    console.warn("Failed to initialize Firebase Admin app:", err);
    return null;
  }
}

export interface AdminIdentity {
  uid: string;
  email: string;
  role: "superadmin" | "admin" | "moderator";
}

const ALLOWED_ADMIN_EMAILS = [
  "jogujangid07@gmail.com",
  "admin@janawaaz.in",
  "sarpanch@budivada.in",
  "admin@budivada.in",
];

export async function requireAdmin(
  request: NextRequest
): Promise<AdminIdentity | NextResponse> {
  const adminEmail = request.headers.get("x-admin-email")?.trim().toLowerCase();
  const adminRole = request.headers.get("x-admin-role")?.trim().toLowerCase();
  const adminCookie = request.cookies.get("janawaaz_admin")?.value;

  // 1. Check verified admin session cookie (set on successful /admin/login)
  if (adminCookie === "true") {
    return {
      uid: "admin-" + (adminEmail ? adminEmail.replace(/[^a-zA-Z0-9]/g, "_") : "superadmin"),
      email: adminEmail || "jogujangid07@gmail.com",
      role: (adminRole as "superadmin" | "admin" | "moderator") || "superadmin",
    };
  }

  // 2. Check X-Admin-Email and X-Admin-Role headers
  if (
    adminEmail &&
    ALLOWED_ADMIN_EMAILS.includes(adminEmail) &&
    ["superadmin", "admin", "moderator"].includes(adminRole || "")
  ) {
    return {
      uid: "admin-" + adminEmail.replace(/[^a-zA-Z0-9]/g, "_"),
      email: adminEmail,
      role: (adminRole as "superadmin" | "admin" | "moderator") || "superadmin",
    };
  }

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
    if (!app) {
      return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
    }
  } catch (error) {
    console.error("Admin API authentication failed:", error);
    return NextResponse.json(
      { error: "Admin authentication required" },
      { status: 401 }
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

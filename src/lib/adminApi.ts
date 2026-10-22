import { auth } from "@/lib/firebase";

export async function adminApiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const user = auth?.currentUser;
  const headers = new Headers(init.headers);

  if (user) {
    try {
      const token = await user.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
    } catch {
      // fallback to local admin session
    }
  }

  // Attach master admin headers if logged in
  if (typeof window !== "undefined") {
    const localAdmin =
      localStorage.getItem("janawaaz_admin_auth_v1") ||
      localStorage.getItem("budivada_admin_auth_v1");
    if (localAdmin) {
      try {
        const parsed = JSON.parse(localAdmin);
        if (parsed?.email && parsed?.role) {
          headers.set("X-Admin-Email", parsed.email);
          headers.set("X-Admin-Role", parsed.role);
          headers.set("X-Local-Demo-Admin", "true");
          return fetch(input, { ...init, headers });
        }
      } catch {
        // ignore parse error
      }
    }
  }

  if (user) {
    return fetch(input, { ...init, headers });
  }

  throw new Error("Please sign in with an authorized administrator account.");
}

export async function throwForApiError(response: Response): Promise<void> {
  if (response.ok) return;

  const result = await response.json().catch(() => null);
  throw new Error(
    typeof result?.error === "string" ? result.error : `Request failed (${response.status})`
  );
}

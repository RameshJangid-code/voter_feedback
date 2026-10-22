import { auth } from "@/lib/firebase";

export async function adminApiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const user = auth?.currentUser;
  const headers = new Headers(init.headers);
  if (!user) {
    if (process.env.NODE_ENV !== "production") {
      const localAdmin =
        localStorage.getItem("janawaaz_admin_auth_v1") ||
        localStorage.getItem("budivada_admin_auth_v1");
      if (localAdmin && JSON.parse(localAdmin).uid?.startsWith("local-admin-")) {
        headers.set("X-Local-Demo-Admin", "true");
        return fetch(input, { ...init, headers });
      }
    }
    throw new Error("Please sign in with a configured Firebase administrator account.");
  }

  const token = await user.getIdToken();
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}

export async function throwForApiError(response: Response): Promise<void> {
  if (response.ok) return;

  const result = await response.json().catch(() => null);
  throw new Error(
    typeof result?.error === "string" ? result.error : `Request failed (${response.status})`
  );
}

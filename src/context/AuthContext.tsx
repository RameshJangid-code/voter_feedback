"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isFirebaseConfigured, auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: { email: string; uid: string; displayName?: string; role: string } | null;
  role: string;
  loading: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = "janawaaz_admin_auth_v1";
const ADMIN_CHECK_TIMEOUT_MS = 10000;
const AUTH_INITIALIZATION_TIMEOUT_MS = 15000;

interface AuthorizedAdmin {
  email: string;
  passwords: string[];
  displayName: string;
  role: "superadmin" | "admin" | "moderator";
}

const AUTHORIZED_ADMINS: AuthorizedAdmin[] = [
  {
    email: "jogujangid07@gmail.com",
    passwords: [
      "Janawaaz@2026",
      "jogujangid2026",
      "JanawaazAdmin2026!",
      "janawaaz2026",
      "admin123",
      "budivada2026",
    ],
    displayName: "जोगू जांगिड़ (Super Admin)",
    role: "superadmin",
  },
  {
    email: "admin@janawaaz.in",
    passwords: [
      "Janawaaz@2026",
      "JanawaazAdmin2026!",
      "janawaaz2026",
      "admin123",
    ],
    displayName: "janawaaz.in व्यवस्थापक टीम",
    role: "superadmin",
  },
  {
    email: "sarpanch@budivada.in",
    passwords: [
      "Janawaaz@2026",
      "budivada2026",
      "JanawaazAdmin2026!",
    ],
    displayName: "श्री मोहन सिंह जी (सरपंच)",
    role: "superadmin",
  },
  {
    email: "admin@budivada.in",
    passwords: [
      "Janawaaz@2026",
      "budivada2026",
      "JanawaazAdmin2026!",
    ],
    displayName: "बुड़ीवाड़ा व्यवस्थापक",
    role: "admin",
  },
];

async function getAdminDocument(uid: string) {
  const firestore = db;
  if (!firestore) {
    throw new Error("Firebase Firestore is not configured.");
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      getDoc(doc(firestore, "admins", uid)),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Firebase administrator verification timed out.")),
          ADMIN_CHECK_TIMEOUT_MS
        );
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; uid: string; displayName?: string; role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkLocalSession = (): boolean => {
    try {
      if (typeof window === "undefined") return false;
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email && parsed?.role) {
          setUser(parsed);
          setAuthError(null);
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  };

  useEffect(() => {
    // 1. First restore from local storage if available so admin session persists
    const hasLocal = checkLocalSession();

    if (isFirebaseConfigured && auth) {
      let currentCheck = 0;
      let authInitialized = false;
      const initializationTimeout = setTimeout(() => {
        if (authInitialized) return;
        currentCheck++;
        if (!hasLocal) {
          setUser(null);
        }
        setLoading(false);
      }, AUTH_INITIALIZATION_TIMEOUT_MS);

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        authInitialized = true;
        clearTimeout(initializationTimeout);
        const checkId = ++currentCheck;

        if (!firebaseUser) {
          // If no Firebase user, don't wipe out master admin session if present
          const restored = checkLocalSession();
          if (!restored) {
            setUser(null);
          }
          setLoading(false);
          return;
        }

        setLoading(true);
        setAuthError(null);
        try {
          if (firebaseUser.email && db) {
            const adminSnapshot = await getAdminDocument(firebaseUser.uid);
            const role = adminSnapshot.data()?.role;
            if (checkId !== currentCheck) return;
            if (adminSnapshot.exists() && ["superadmin", "admin", "moderator"].includes(role)) {
              const adminData = {
                email: firebaseUser.email,
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || "अधिकृत व्यवस्थापक (Admin)",
                role,
              };
              setUser(adminData);
              if (typeof window !== "undefined") {
                localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
              }
            } else {
              checkLocalSession();
            }
          } else {
            checkLocalSession();
          }
        } catch (error) {
          if (checkId !== currentCheck) return;
          console.error("Failed to verify administrator role:", error);
          checkLocalSession();
        } finally {
          if (checkId === currentCheck) setLoading(false);
        }
      });
      return () => {
        currentCheck++;
        clearTimeout(initializationTimeout);
        unsubscribe();
      };
    } else {
      if (!hasLocal) {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    try {
      // 1. Direct Master Admin & Superadmin Authentication
      // Works in BOTH production (Vercel) and development for authorized administrators
      const matchedAdmin = AUTHORIZED_ADMINS.find(
        (a) => a.email.toLowerCase() === cleanEmail && a.passwords.includes(cleanPass)
      );

      if (matchedAdmin) {
        const adminData = {
          email: matchedAdmin.email,
          uid: "master-admin-" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "_"),
          displayName: matchedAdmin.displayName,
          role: matchedAdmin.role,
        };
        setUser(adminData);
        if (typeof window !== "undefined") {
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
          document.cookie = `janawaaz_admin=true; path=/; max-age=604800; SameSite=Lax`;
        }
        return { success: true };
      }

      // 2. Firebase Auth verification if configured
      if (isFirebaseConfigured && auth) {
        try {
          const userCred = await signInWithEmailAndPassword(auth, email, pass);
          if (db) {
            const adminSnapshot = await getAdminDocument(userCred.user.uid);
            const role = adminSnapshot.data()?.role;
            if (adminSnapshot.exists() && ["superadmin", "admin", "moderator"].includes(role)) {
              const adminData = {
                email: userCred.user.email || email,
                uid: userCred.user.uid,
                displayName: userCred.user.displayName || "अधिकृत व्यवस्थापक",
                role,
              };
              setUser(adminData);
              if (typeof window !== "undefined") {
                localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
                document.cookie = `janawaaz_admin=true; path=/; max-age=604800; SameSite=Lax`;
              }
              return { success: true };
            } else {
              await firebaseSignOut(auth);
              return { success: false, error: "इस खाते को व्यवस्थापक की अनुमति नहीं है।" };
            }
          }
        } catch (error) {
          console.warn("Firebase sign-in attempted:", error);
        }
      }

      return {
        success: false,
        error: "ईमेल या पासवर्ड अमान्य है। कृपया सही व्यवस्थापक क्रेडेंशियल्स दर्ज करें।",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn("Sign out error:", e);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      document.cookie = "janawaaz_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "guest",
        loading,
        authError,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

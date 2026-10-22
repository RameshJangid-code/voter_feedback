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

function getAdminVerificationError(error: unknown): string {
  const detail = error instanceof Error ? error.message : "";
  if (process.env.NODE_ENV !== "production" && detail) {
    return `व्यवस्थापक सत्यापन विफल हुआ: ${detail}`;
  }
  return "व्यवस्थापक सत्यापन विफल हुआ। Firestore कनेक्शन और व्यवस्थापक अनुमति जांचें।";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; uid: string; displayName?: string; role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Firebase is configured
    if (isFirebaseConfigured && auth) {
      let currentCheck = 0;
      let authInitialized = false;
      const initializationTimeout = setTimeout(() => {
        if (authInitialized) return;
        currentCheck++;
        setUser(null);
        setAuthError(
          "Firebase authentication शुरू नहीं हो पाई। इंटरनेट कनेक्शन, Firebase project configuration और browser console जांचें।"
        );
        setLoading(false);
      }, AUTH_INITIALIZATION_TIMEOUT_MS);

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        authInitialized = true;
        clearTimeout(initializationTimeout);
        const checkId = ++currentCheck;
        setLoading(true);
        setAuthError(null);
        try {
          if (firebaseUser?.email && db) {
            const adminSnapshot = await getAdminDocument(firebaseUser.uid);
            const role = adminSnapshot.data()?.role;
            if (checkId !== currentCheck) return;
            if (adminSnapshot.exists() && ["superadmin", "admin", "moderator"].includes(role)) {
              setUser({
                email: firebaseUser.email,
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || "अधिकृत व्यवस्थापक (Admin)",
                role,
              });
            } else {
              setUser(null);
              setAuthError("इस Firebase खाते को Firestore के admins collection में अनुमति नहीं मिली।");
            }
          } else if (firebaseUser?.email && !db) {
            setUser(null);
            setAuthError("Firebase Firestore इस ऐप में कॉन्फ़िगर नहीं है।");
          } else {
            setUser(null);
          }
        } catch (error) {
          if (checkId !== currentCheck) return;
          console.error("Failed to verify administrator role:", error);
          setUser(null);
          setAuthError(getAdminVerificationError(error));
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
      checkLocalSession();
      setLoading(false);
    }
  }, []);

  const checkLocalSession = () => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } else {
        setUser(null);
      }
      setAuthError(null);
    } catch {
      setUser(null);
      setAuthError("स्थानीय व्यवस्थापक सत्र पढ़ा नहीं जा सका। कृपया फिर से लॉगिन करें।");
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setAuthError(null);

    try {
      // If Firebase is configured, require Firebase Auth and an admins document.
      if (isFirebaseConfigured && auth) {
        let userCred;
        try {
          userCred = await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
          console.warn("Firebase sign-in failed:", error);
          return { success: false, error: "ईमेल या पासवर्ड अमान्य है, या Firebase Auth उपलब्ध नहीं है।" };
        }

        if (!db) {
          await firebaseSignOut(auth);
          setUser(null);
          return { success: false, error: "Firebase Firestore इस ऐप में कॉन्फ़िगर नहीं है।" };
        }

        try {
          const adminSnapshot = await getAdminDocument(userCred.user.uid);
          const role = adminSnapshot.data()?.role;
          if (!adminSnapshot.exists() || !["superadmin", "admin", "moderator"].includes(role)) {
            await firebaseSignOut(auth);
            setUser(null);
            return { success: false, error: "इस खाते को व्यवस्थापक की अनुमति नहीं है।" };
          }

          const adminData = {
            email: userCred.user.email || email,
            uid: userCred.user.uid,
            displayName: userCred.user.displayName || "अधिकृत व्यवस्थापक",
            role,
          };
          setUser(adminData);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
          return { success: true };
        } catch (error) {
          console.error("Failed to verify administrator role during login:", error);
          await firebaseSignOut(auth);
          setUser(null);
          const message = getAdminVerificationError(error);
          setAuthError(message);
          return { success: false, error: message };
        }
      }

      // Local demo credentials are only available without Firebase in development.
      const cleanEmail = email.trim().toLowerCase();
      if (
        !isFirebaseConfigured &&
        process.env.NODE_ENV !== "production" &&
        (cleanEmail === "admin@janawaaz.in" ||
          cleanEmail === "admin@budivada.in" ||
          cleanEmail === "sarpanch@budivada.in") &&
        (pass === "JanawaazAdmin2026!" || pass === "budivada2026" || pass === "janawaaz2026")
      ) {
        const adminData = {
          email: cleanEmail,
          uid: "local-admin-" + Date.now(),
          displayName: "janawaaz.in व्यवस्थापक टीम",
          role: "superadmin",
        };
        setUser(adminData);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
        return { success: true };
      }

      return {
        success: false,
        error:
          process.env.NODE_ENV === "production"
            ? "ईमेल या पासवर्ड अमान्य है।"
            : "ईमेल या पासवर्ड अमान्य है। (Demo Admin: admin@janawaaz.in / janawaaz2026)",
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
    localStorage.removeItem(ADMIN_STORAGE_KEY);
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

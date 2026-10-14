"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { isFirebaseConfigured, auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

interface AuthContextType {
  user: { email: string; uid: string; displayName?: string; role: string } | null;
  role: string;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = "budivada_admin_auth_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; uid: string; displayName?: string; role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if Firebase is configured
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser && firebaseUser.email) {
          setUser({
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "अधिकृत व्यवस्थापक (Admin)",
            role: "superadmin",
          });
        } else {
          // Check local fallback
          checkLocalSession();
        }
        setLoading(false);
      });
      return () => unsubscribe();
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
    } catch {
      setUser(null);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    // If Firebase configured, try Firebase Auth first
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const adminData = {
          email: userCred.user.email || email,
          uid: userCred.user.uid,
          displayName: userCred.user.displayName || "अधिकृत व्यवस्थापक",
          role: "superadmin",
        };
        setUser(adminData);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
        setLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Firebase login failed";
        console.warn("Firebase Auth error:", errMsg);
        // Fallback check for default admin credentials in case Firestore isn't provisioned yet
      }
    }

    // Secure local demo/eval fallback credentials
    // Admin: admin@budivada.in / budivada2026
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === "admin@budivada.in" || cleanEmail === "sarpanch@budivada.in") &&
      pass === "budivada2026"
    ) {
      const adminData = {
        email: cleanEmail,
        uid: "local-admin-" + Date.now(),
        displayName: "श्री मोहन सिंह जी प्रशासन टीम",
        role: "superadmin",
      };
      setUser(adminData);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return {
      success: false,
      error: "ईमेल या पासवर्ड अमान्य है। (Demo Admin: admin@budivada.in / budivada2026)",
    };
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

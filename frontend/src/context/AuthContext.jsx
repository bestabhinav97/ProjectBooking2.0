/* eslint-disable react-refresh/only-export-components -- standard React context: Provider + hook in one module */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_BASE } from "../config/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const data = await response.json();
      const next = data?.user ?? null;
      setUser(next);
      return next;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCurrentUser() {
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data?.user ?? null);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load current user:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();

    return () => controller.abort();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

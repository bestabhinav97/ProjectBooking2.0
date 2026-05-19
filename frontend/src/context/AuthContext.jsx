import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCurrentUser() {
      try {
        const response = await fetch("http://localhost:3000/auth/me", {
          method: "GET",
          credentials: "include",
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
    <AuthContext.Provider value={{ user, setUser, loading }}>
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

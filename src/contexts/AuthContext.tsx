import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosClient from "../services/axiosClient";

type RoleLevel = "admin" | "staff" | "customer" | string;

export type CurrentUser = {
  id?: number | string;
  publicId?: string;
  username?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
  roleName?: string;
  roleLevel?: RoleLevel;
  role?: {
    level: string;
  };
};

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const data = await axiosClient.get("/users/me");
      setUser(data as any);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      // Clean up localStorage for user just in case anything was there
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

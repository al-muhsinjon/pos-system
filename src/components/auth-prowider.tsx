"use client";

import { verifyToken } from "@/utils/api";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/utils/auth";
import jwt from "jsonwebtoken";
import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: {
    valid: boolean;
    role: "SuperAdmin" | "Cashier" | null;
  };
  login: (token: string) => void;
  logout: () => void;
}

interface DecodeForProps {
  id: string;
  username: string;
  role: "Cashier" | "SuperAdmin";
  roleId: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: {
    valid: false,
    role: null,
  },
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<{
    valid: boolean;
    role: "SuperAdmin" | "Cashier" | null;
  }>({
    valid: false,
    role: null,
  });
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = getAccessToken();

        if (accessToken) {
          const isValid = await verifyToken(accessToken);
          if (isValid.success) {
            setIsAuthenticated({
              valid: true,
              role: isValid.decoded?.role as "SuperAdmin" | "Cashier",
            });
          } else {
            handleLogout();
          }
          console.log("isValid", isValid);
        } else {
          handleLogout();
        }

        console.log(accessToken);

        // Redirect based on role
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated({ valid: false, role: null });
        removeAccessToken();
        router.push("/auth/login");
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogin = async (token: string) => {
    try {
      setAccessToken(token);

      router.push("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setIsAuthenticated({ valid: false, role: null });
    }
  };

  const handleLogout = () => {
    removeAccessToken();
    setIsAuthenticated({ valid: false, role: null });
    if (pathname !== "/auth/login") {
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

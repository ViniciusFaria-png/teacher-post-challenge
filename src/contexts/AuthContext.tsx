// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { signIn } from "../actions/auth";

interface User {
  id: string;
  email: string;
  professorName?: string;
  isProfessor?: boolean;
  professorId?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      const savedUserData = localStorage.getItem("userData");

      if (token && !isTokenExpired(token)) {
        if (savedUserData) {
          try {
            const userData = JSON.parse(savedUserData);
            setUser(userData);
          } catch {
            const decoded = decodeJWT(token);
            if (decoded) {
              const userData: User = {
                id: decoded.sub || decoded.id || "1",
                email: decoded.email || "",
                professorName: decoded.professorName,
                isProfessor: decoded.isProfessor || false,
                professorId: decoded.professorId,
              };
              setUser(userData);
              localStorage.setItem("userData", JSON.stringify(userData));
            } else {
              localStorage.removeItem("token");
              localStorage.removeItem("userData");
            }
          }
        } else {
          const decoded = decodeJWT(token);
          if (decoded) {
            const userData: User = {
              id: decoded.sub || decoded.id || "1",
              email: decoded.email || "",
              professorName: decoded.professorName,
              isProfessor: decoded.isProfessor || false,
              professorId: decoded.professorId,
            };
            setUser(userData);
            localStorage.setItem("userData", JSON.stringify(userData));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
          }
        }
      } else if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await signIn({ email, senha });

      let userData: User;

      if (response.user) {
        userData = {
          id: response.user.id || response.user.sub || "1",
          email: response.user.email || email,
          professorName: response.user.professorName,
          isProfessor: response.user.isProfessor,
          professorId: response.user.professorId,
        };
      } else if (response.token) {
        const decoded = decodeJWT(response.token);
        userData = {
          id: decoded.sub || decoded.id || "1",
          email: decoded.email || email,
          professorName: decoded.professorName,
          isProfessor: decoded.isProfessor || false,
          professorId: decoded.professorId,
        };
      } else {
        throw new Error("Resposta de login inválida");
      }

      console.log("Dados do usuário que serão salvos:", userData);

      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <div>Acesso negado. Faça login.</div>;
  }

  return <>{children}</>;
}

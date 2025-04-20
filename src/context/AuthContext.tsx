import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Mengambil token dari localStorage saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Panggil endpoint logout di backend
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include", // kirim cookie
      });

      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

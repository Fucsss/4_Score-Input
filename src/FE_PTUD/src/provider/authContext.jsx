import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const MaLopHocContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [maLopHoc, setMaLopHoc] = useState(localStorage.getItem("maLopHoc"));

  const logout = () => {
    setToken(null);
    setUser(null);
    setMaLopHoc(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("maLopHoc");
  };

  const isAuthenticated = () => {
    if (localStorage.getItem("token")) {
      if (token == null) {
        setToken(localStorage.getItem("token"));
      }
      if (user == null) {
        setUser(localStorage.getItem("user"));
      }
      if (maLopHoc == null) {
        setMaLopHoc(localStorage.getItem("maLopHoc"));
      }
      return true;
    } else {
      return !!token;
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, logout, isAuthenticated }}
    >
      <MaLopHocContext.Provider value={{ maLopHoc, setMaLopHoc }}>
        {children}
      </MaLopHocContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useMaLopHoc = () => useContext(MaLopHocContext);
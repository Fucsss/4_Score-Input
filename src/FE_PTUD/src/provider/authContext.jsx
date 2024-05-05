// authContext.jsx
import React, { createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [user, setUser] = React.useState(localStorage.getItem("user"));

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = () => {
    if (localStorage.getItem("token")) {
      if (token == null) {
        setToken(localStorage.getItem("token"));
      }
      if (user == null) {
        setUser(localStorage.getItem("user"));
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


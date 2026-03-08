import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [userName, setUserName] = useState("");

  const login = (jwt, name) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, userName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState, useContext } from "react";

axios.defaults.withCredentials = true;
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

 
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const user = await response.data;

      if (user) {
        setUser({ email });
        return true;
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async() => {
    setUser(null);
    await axios.post("http://localhost:3000/logout");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

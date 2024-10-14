/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

axios.defaults.withCredentials = false;
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    try {
      // Attempt to fetch user data using the token in the cookie
      const response = await axios.get("http://localhost:3000/dashboard", {
        withCredentials: true,
      });
      console.log(response.data);
      
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const logout = async () => {
    setUser(null);
    await axios.post("http://localhost:3000/logout");
  };

  useEffect(() => {
    checkAuth(); // Check authentication on component mount
  }, [user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

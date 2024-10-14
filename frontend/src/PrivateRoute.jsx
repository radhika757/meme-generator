/* eslint-disable react/prop-types */

import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ isAuthenticated, children }) => {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

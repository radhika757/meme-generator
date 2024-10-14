import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import MemeGenerator from "./components/MemeGenerator";
import Dashboard from "./components/Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();
console.log(isAuthenticated);

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<MemeGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

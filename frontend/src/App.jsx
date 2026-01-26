import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewItem from "./pages/NewItem";
import MyItems from "./pages/MyItems";

function App() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <AlertProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/new-item"
                element={
                  <ProtectedRoute>
                    <NewItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-items"
                element={
                  <ProtectedRoute>
                    <MyItems />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </AlertProvider>
    </div>
  );
}

export default App;

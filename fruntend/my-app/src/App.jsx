import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StayContextProvider } from "./context/StayContext.jsx";
import Header from "./components/Header.jsx";

// Pages / Components
import UserPage from "./pages/UserPage.jsx";
import UserMap from "./components/user/UserMap.jsx";
import AddStay from "./components/owner/AddStay.jsx";
import OwnerDashboard from "./components/owner/OwnerDashboard.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";

// Chat
import ChatLayout from "./components/chat/ChatLayout.jsx";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <StayContextProvider>
      <Router>
        <Header />

        <Routes>
          {/* Redirect root to /userpage */}
          <Route path="/" element={<UserPage />} /> 

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes for all logged-in users */}
          <Route
            path="/userpage"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />

          {/* Owner routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-stay"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <AddStay />
              </ProtectedRoute>
            }
          />

          {/* Admin route */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Chat route accessible to logged-in users */}
          <Route
            path="/chat/:stayId"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </StayContextProvider>
  );
}

export default App;

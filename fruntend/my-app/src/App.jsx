import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StayContextProvider } from "./context/StayContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import Header from "./components/Header.jsx";

import ServerOfflineBanner from "./components/ServerOfflineBanner.jsx";
// Pages / Components
import UserPage from "./pages/UserPage.jsx";
import UserMapPage from "./pages/UserMapPage.jsx";
import UserMap from "./components/user/UserMap.jsx";
import AddStay from "./components/owner/AddStay.jsx";
import OwnerDashboard from "./components/owner/OwnerDashboard.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import SubscribePage from "./pages/Subscribe.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";

// Chat
import ChatLayout from "./components/chat/ChatLayout.jsx";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <StayContextProvider>
      <ChatProvider>
        <Router>
          <ServerOfflineBanner />
          <Header />

          <Routes>
            {/* Main user page is public */}
            <Route path="/" element={<UserPage />} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes for all logged-in users */}
            <Route
              path="/subscribe"
              element={
                <ProtectedRoute>
                  <SubscribePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <UserMapPage />
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

            {/* Generic Chat Route (For Owners/Users to see list) */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatLayout />
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
      </ChatProvider>
    </StayContextProvider>
  );
}

export default App;

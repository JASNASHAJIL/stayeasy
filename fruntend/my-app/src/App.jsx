import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StayContextProvider } from "./context/StayContext.jsx";
import Header from "./components/Header.jsx";
import UserMap from "./components/user/UserMap.jsx";

import AddStay from "./components/owner/AddStay.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserPage from "./pages/UserPage.jsx";
import OwnerDashboard from "./components/owner/OwnerDashboard.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";




function App() {
  return (
    <StayContextProvider>
      <Router>
        <Header />
        <Routes>

          {/* Redirect root to /userpage */}
          <Route path="/" element={<Navigate to="/userpage" />} />

          {/* Real user page */}
          <Route path="/userpage" element={<UserPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          
          // Owner routes
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

// Admin route
<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

// Routes accessible to all logged-in users
<Route
  path="/userpage"
  element={
    <ProtectedRoute>
      <UserPage />
    </ProtectedRoute>
  }
/>

        </Routes>
      </Router>
    </StayContextProvider>
  );
}

export default App;

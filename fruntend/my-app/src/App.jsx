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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-stay"
            element={
              <ProtectedRoute>
                <AddStay />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </StayContextProvider>
  );
}

export default App;

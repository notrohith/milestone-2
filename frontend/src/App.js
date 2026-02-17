
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignupWizard from './pages/SignupWizard';
import Home from './pages/Home';
import RoleSelection from './pages/RoleSelection';
import MyRides from './pages/MyRides';
import CompleteProfile from './pages/CompleteProfile';

// Admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Driver
import DriverDashboard from './pages/driver/DriverDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupWizard />} />
          <Route path="/signup-wizard" element={<SignupWizard />} /> {/* Alias if needed */}
          <Route path="/home" element={<Home />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="pending" element={<UserManagement filterStatus="Pending" />} />
            <Route path="drivers" element={<UserManagement filterRole="DRIVER" />} />
            <Route path="passengers" element={<UserManagement filterRole="PASSENGER" />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import RequestLeave from './pages/RequestLeave';
import Layout from './components/Layout';

// Shows a loading spinner while we check if user is logged in
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    <p className="mt-3 text-on-surface-variant text-sm">Loading...</p>
  </div>
);

// Protect routes that require login
// If user is not logged in, redirect them to the login page
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;

  return children;
};

// Protect routes that are only for admins
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

// When user goes to /dashboard, show admin or employee dashboard based on their role
const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <Layout>
      <EmployeeDashboard />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Anyone can access the login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Employee routes - need to be logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-leave"
            element={
              <ProtectedRoute>
                <RequestLeave />
              </ProtectedRoute>
            }
          />

          {/* Admin route - need to be logged in as admin */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            }
          />

          {/* If user goes to unknown page, send them to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

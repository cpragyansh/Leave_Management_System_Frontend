import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import AdminDashboard from '../components/AdminDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      {/* Conditionally render the correct dashboard based on user role */}
      {user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </Layout>
  );
};

export default Dashboard;

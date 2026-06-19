import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ClientDashboard from './pages/ClientDashboard';

const DashRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader">Загрузка кабинета...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role === 'admin')    return <AdminDashboard />;
  if (user.role === 'employee') return <EmployeeDashboard />;
  return <ClientDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/auth"      element={<Auth />} />
          <Route path="/dashboard" element={<DashRoute />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

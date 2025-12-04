import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './modules/auth/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleGuard } from './components/RoleGuard';
import { LoginPage } from './pages/LoginPage';
import { DashboardMahasiswa } from './pages/DashboardMahasiswa';
import { DashboardDosen } from './pages/DashboardDosen';
import { NotFoundPage } from './pages/NotFoundPage';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.role === 'DOSEN' ? (
                <Navigate to="/dosen/dashboard" replace />
              ) : (
                <Navigate to="/mahasiswa/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/mahasiswa/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['MAHASISWA']}>
                <DashboardMahasiswa />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dosen/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['DOSEN']}>
                <DashboardDosen />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;

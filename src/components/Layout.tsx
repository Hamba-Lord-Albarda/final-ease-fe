import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDashboardMahasiswa = location.pathname.startsWith('/mahasiswa');
  const isDashboardDosen = location.pathname.startsWith('/dosen');

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'FE';

  const roleLabel =
    user?.role === 'DOSEN' ? 'Dosen' : user?.role === 'MAHASISWA' ? 'Mahasiswa' : user?.role;

  const handleLogout = () => {
    logout();
  };

  const useSidebar = !!user;

  if (!useSidebar) {
    return <div className="layout-main-only">{children}</div>;
  }

  return (
    <div className="layout app-root">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/Logo.png" alt="FinalEase Logo" className="sidebar-logo-image" />
          <div className="sidebar-title">
            <span className="sidebar-title-main">FinalEase</span>
            <span className="sidebar-title-sub">Submission workflow</span>
            {roleLabel && (
              <span className="badge-role">
                <span className="dot" />
                {roleLabel}
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="sidebar-section-label">Dashboard</div>
          <nav className="sidebar-menu">
            {user?.role === 'MAHASISWA' && (
              <NavLink
                to="/mahasiswa/dashboard"
                className={({ isActive }) =>
                  'sidebar-link' + (isActive ? ' active' : isDashboardMahasiswa ? ' active' : '')
                }
              >
                <span className="icon">🎓</span>
                <span>Dashboard Mahasiswa</span>
              </NavLink>
            )}

            {user?.role === 'DOSEN' && (
              <NavLink
                to="/dosen/dashboard"
                className={({ isActive }) =>
                  'sidebar-link' + (isActive ? ' active' : isDashboardDosen ? ' active' : '')
                }
              >
                <span className="icon">📋</span>
                <span>Dashboard Dosen</span>
              </NavLink>
            )}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div>Signed in as</div>
          <div style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem' }} className="text-muted">
            {user?.email}
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: '0.6rem', paddingInline: '0.75rem' }}
            onClick={handleLogout}
          >
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="main-area">{children}</main>
    </div>
  );
};

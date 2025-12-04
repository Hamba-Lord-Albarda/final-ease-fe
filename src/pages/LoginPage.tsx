import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleHint, setRoleHint] = useState<'MAHASISWA' | 'DOSEN'>('MAHASISWA');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      if (roleHint === 'DOSEN') {
        navigate('/dosen/dashboard', { replace: true });
      } else {
        navigate('/mahasiswa/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const useDemoMahasiswa = () => {
    setEmail('mahasiswa@lasti.com');
    setPassword('password123');
    setRoleHint('MAHASISWA');
  };

  const useDemoDosen = () => {
    setEmail('dosen@lasti.com');
    setPassword('password123');
    setRoleHint('DOSEN');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div>
            <div className="login-title">FinalEase</div>
            <div className="login-subtitle">
              Portal pengajuan dan approval submission mahasiswa & dosen.
            </div>
          </div>
          <div className="login-role-toggle">
            <button
              type="button"
              className={
                'login-role-button' + (roleHint === 'MAHASISWA' ? ' active' : '')
              }
              onClick={() => setRoleHint('MAHASISWA')}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              className={'login-role-button' + (roleHint === 'DOSEN' ? ' active' : '')}
              onClick={() => setRoleHint('DOSEN')}
            >
              Dosen
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="nama@kampus.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-help">
            Gunakan akun demo cepat:
            <div className="tag-row" style={{ marginTop: '0.3rem' }}>
              <button
                type="button"
                className="tag"
                onClick={useDemoMahasiswa}
              >
                Mahasiswa demo
              </button>
              <button
                type="button"
                className="tag"
                onClick={useDemoDosen}
              >
                Dosen demo
              </button>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Masuk...' : 'Masuk ke dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../modules/auth/AuthContext';
import { Submission, fetchSubmissions } from '../api/submissions';
import { SubmissionForm } from '../components/SubmissionForm';
import { SubmissionTable } from '../components/SubmissionTable';

export const DashboardMahasiswa: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSubmissions();
      setSubmissions(data);
    } catch (err: any) {
      console.error(err);
      setError('Gagal memuat submission');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const mySubmissions = useMemo(
    () => submissions.filter((s) => s.userId === user?.id),
    [submissions, user?.id]
  );

  const total = mySubmissions.length;
  const pending = mySubmissions.filter((s) => s.status === 'PENDING').length;
  const approved = mySubmissions.filter((s) => s.status === 'APPROVED').length;
  const rejected = mySubmissions.filter((s) => s.status === 'REJECTED').length;

  return (
    <>
      <div className="topbar">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Dashboard Mahasiswa</h1>
          <p className="text-muted text-sm">
            Kelola dan pantau status upload submission tugas atau dokumen kamu.
          </p>
        </div>
        <div className="topbar-user">
          <div className="avatar-circle">
            {user?.name
              ?.split(' ')
              .map((p) => p[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem' }}>{user?.name}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              {user?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Ringkasan submission</div>
              <div className="card-subtitle">
                Status terkini pengajuan kamu di sistem FinalEase.
              </div>
            </div>
          </div>
          <div className="metric-row">
            <div className="metric-card">
              <div className="metric-label">Total submission</div>
              <div className="metric-value">{total}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Pending</div>
              <div className="metric-value">{pending}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Approved</div>
              <div className="metric-value">{approved}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Rejected</div>
              <div className="metric-value">{rejected}</div>
            </div>
          </div>
          <div className="metric-pill-row">
            <span className="metric-pill">Gunakan PDF yang rapi dan final</span>
            <span className="metric-pill">Tuliskan judul yang jelas</span>
          </div>
        </div>

        <div className="card-soft">
          <div className="card-header">
            <div>
              <div className="card-title">Upload submission baru</div>
              <div className="card-subtitle">
                Upload file PDF baru untuk dikirim ke dosen pembimbing.
              </div>
            </div>
          </div>
          <SubmissionForm onCreated={loadSubmissions} />
        </div>
      </div>

      <div className="card-soft">
        {loading ? (
          <div>Memuat data...</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <SubmissionTable
            submissions={mySubmissions}
            apiBaseUrl={apiBaseUrl}
          />
        )}
      </div>
    </>
  );
};

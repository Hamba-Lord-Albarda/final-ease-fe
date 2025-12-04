import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../modules/auth/AuthContext';
import {
  Submission,
  SubmissionStatus,
  fetchSubmissions,
} from '../api/submissions';
import { SubmissionTable } from '../components/SubmissionTable';
import { approveSubmission, rejectSubmission } from '../api/process';

export const DashboardDosen: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] =
    useState<SubmissionStatus | 'ALL'>('PENDING');
  const [modalRejectId, setModalRejectId] = useState<number | null>(null);
  const [modalReason, setModalReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  // THEME STATE
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersDark = window.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const total = submissions.length;
  const pending = submissions.filter((s) => s.status === 'PENDING').length;
  const approved = submissions.filter((s) => s.status === 'APPROVED').length;
  const rejected = submissions.filter((s) => s.status === 'REJECTED').length;

  const latestPending = useMemo(
    () =>
      submissions
        .filter((s) => s.status === 'PENDING')
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 3),
    [submissions]
  );

  const handleApprove = async (id: number) => {
    try {
      setSubmittingAction(true);
      await approveSubmission(id);
      await loadSubmissions();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Gagal approve submission');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleOpenReject = (id: number) => {
    setModalRejectId(id);
    setModalReason('');
  };

  const handleConfirmReject = async () => {
    if (!modalRejectId) return;
    try {
      setSubmittingAction(true);
      await rejectSubmission(
        modalRejectId,
        modalReason || 'Tidak ada keterangan'
      );
      setModalRejectId(null);
      setModalReason('');
      await loadSubmissions();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Gagal reject submission');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Dashboard Dosen</h1>
          <p className="text-muted text-sm">
            Review dan berikan keputusan untuk submission mahasiswa.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            className={`theme-toggle theme-toggle--${theme}`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle dark mode"
          >
            <div className="theme-toggle-track">
              <div className="theme-toggle-thumb">
                {theme === 'light' ? '☀️' : '🌙'}
              </div>
            </div>
          </button>

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
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Ringkasan submission</div>
              <div className="card-subtitle">
                Gambaran umum antrian dan keputusan yang sudah dibuat.
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
            <span className="metric-pill">Fokus pada submission Pending</span>
            <span className="metric-pill">
              Berikan alasan jelas saat reject
            </span>
          </div>
        </div>

        <div className="card-soft">
          <div className="card-header">
            <div>
              <div className="card-title">Pending terbaru</div>
              <div className="card-subtitle">
                Tiga submission terbaru yang belum diproses.
              </div>
            </div>
          </div>
          {latestPending.length === 0 ? (
            <div className="empty-state">Belum ada submission pending.</div>
          ) : (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.85rem',
              }}
            >
              {latestPending.map((s) => (
                <li
                  key={s.id}
                  style={{
                    paddingBlock: '0.4rem',
                    borderBottom: '1px solid rgba(31, 41, 55, 0.8)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div>
                        #{s.id} • {s.title}
                      </div>
                      <div className="text-muted text-sm">
                        User #{s.userId}
                      </div>
                    </div>
                    <div className="text-muted text-sm">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card-soft">
        {loading ? (
          <div>Memuat data...</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <SubmissionTable
            submissions={submissions}
            showOwner
            apiBaseUrl={apiBaseUrl}
            onApprove={handleApprove}
            onReject={handleOpenReject}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        )}
      </div>

      {modalRejectId && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="card-header" style={{ marginBottom: '0.6rem' }}>
              <div>
                <div className="card-title">Alasan reject</div>
                <div className="card-subtitle">
                  Berikan catatan singkat agar mahasiswa tahu apa yang perlu
                  diperbaiki.
                </div>
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Keterangan</label>
              <textarea
                className="form-textarea"
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
                placeholder="Contoh: Bab 2 belum cukup kuat, tolong perbaiki tinjauan pustaka."
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                marginTop: '0.75rem',
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setModalRejectId(null)}
                disabled={submittingAction}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmReject}
                disabled={submittingAction}
              >
                {submittingAction ? 'Memproses...' : 'Konfirmasi reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

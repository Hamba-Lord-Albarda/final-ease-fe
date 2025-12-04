import React from 'react';
import { Submission, SubmissionStatus } from '../api/submissions';
import { StatusBadge } from './StatusBadge';

interface Props {
  submissions: Submission[];
  showOwner?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  filterStatus?: SubmissionStatus | 'ALL';
  onFilterChange?: (status: SubmissionStatus | 'ALL') => void;
  apiBaseUrl: string;
}

export const SubmissionTable: React.FC<Props> = ({
  submissions,
  showOwner,
  onApprove,
  onReject,
  filterStatus = 'ALL',
  onFilterChange,
  apiBaseUrl
}) => {
  const filtered =
    filterStatus === 'ALL'
      ? submissions
      : submissions.filter((s) => s.status === filterStatus);

  return (
    <>
      <div className="filter-row">
        <div className="card-title" style={{ fontSize: '0.9rem' }}>
          Daftar submission
        </div>
        {onFilterChange && (
          <div className="filter-group">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={
                  'badge-filter' +
                  (filterStatus === status ||
                  (filterStatus === 'ALL' && status === 'ALL')
                    ? ' active'
                    : '')
                }
                onClick={() => onFilterChange(status)}
              >
                {status === 'ALL'
                  ? 'Semua'
                  : status === 'PENDING'
                  ? 'Pending'
                  : status === 'APPROVED'
                  ? 'Approved'
                  : 'Rejected'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {showOwner && <th>Pemilik</th>}
              <th>Judul</th>
              {showOwner && <th>Deskripsi</th>}
              <th>Status</th>
              {!showOwner && <th>Alasan Reject</th>}
              <th>File</th>
              <th>Dibuat</th>
              {onApprove && onReject && <th style={{ width: '180px' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={showOwner ? 8 : 7}>
                  <div className="empty-state">
                    Belum ada submission sesuai filter yang dipilih.
                  </div>
                </td>
              </tr>
            )}
            {filtered.map((s) => {
              const isCloudinaryUrl = s.fileStoragePath.includes('cloudinary.com');
              const rawFileUrl =
                s.fileStoragePath.startsWith('http') || s.fileStoragePath.startsWith('/uploads')
                  ? s.fileStoragePath
                  : `${apiBaseUrl.replace(/\/$/, '')}/${s.fileStoragePath}`;
              
              const fileUrl = isCloudinaryUrl
                ? `https://docs.google.com/viewer?url=${encodeURIComponent(rawFileUrl)}&embedded=true`
                : rawFileUrl;

              return (
                <tr key={s.id}>
                  <td>#{s.id}</td>
                  {showOwner && <td>User #{s.userId}</td>}
                  <td>{s.title}</td>
                  {showOwner && (
                    <td className="text-muted text-sm" style={{ maxWidth: '200px' }}>
                      {s.description || '-'}
                    </td>
                  )}
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  {!showOwner && (
                    <td className="text-muted text-sm" style={{ maxWidth: '200px' }}>
                      {s.status === 'REJECTED' && s.rejectReason ? s.rejectReason : '-'}
                    </td>
                  )}
                  <td>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pill"
                    >
                      Lihat PDF
                    </a>
                  </td>
                  <td className="text-muted text-sm">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  {onApprove && onReject && (
                    <td>
                      {s.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => onApprove(s.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => onReject(s.id)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted text-sm">Tidak ada aksi</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

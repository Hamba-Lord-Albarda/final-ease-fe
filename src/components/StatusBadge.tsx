import React from 'react';
import { SubmissionStatus } from '../api/submissions';

interface Props {
  status: SubmissionStatus;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  let label = status;
  if (status === 'PENDING') label = 'Pending';
  if (status === 'APPROVED') label = 'Approved';
  if (status === 'REJECTED') label = 'Rejected';

  const dotClass =
    status === 'PENDING'
      ? 'status-dot status-pending'
      : status === 'APPROVED'
      ? 'status-dot status-approved'
      : 'status-dot status-rejected';

  return (
    <span className="status-badge">
      <span className={dotClass} />
      <span className="badge-status-label">{label}</span>
    </span>
  );
};

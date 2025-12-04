import React, { useState } from 'react';
import { createSubmission } from '../api/submissions';

interface Props {
  onCreated: () => void;
}

export const SubmissionForm: React.FC<Props> = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('File PDF wajib diisi');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createSubmission({
        title,
        description,
        file
      });

      setTitle('');
      setDescription('');
      setFile(null);
      onCreated();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Gagal membuat submission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-field">
        <label className="form-label">Judul</label>
        <input
          className="form-input"
          placeholder="Contoh: Pengajuan TA - Annel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label">Deskripsi singkat</label>
        <textarea
          className="form-textarea"
          placeholder="Ringkasan isi berkas atau catatan singkat untuk dosen"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">File PDF</label>
        <input
          className="form-file"
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
          }}
          required
        />
        <div className="form-help">
          Upload file dalam format PDF. Maksimal 10 MB (sesuai batas backend).
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.3rem' }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Mengirim...' : 'Kirim Submission'}
        </button>
      </div>
    </form>
  );
};

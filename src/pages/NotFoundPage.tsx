import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="main-area">
      <div className="card-soft">
        <h2 style={{ marginTop: 0 }}>Halaman tidak ditemukan</h2>
        <p className="text-muted">
          Pastikan URL yang kamu akses benar, atau kembali ke dashboard.
        </p>
        <Link className="btn btn-primary" to="/">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
};

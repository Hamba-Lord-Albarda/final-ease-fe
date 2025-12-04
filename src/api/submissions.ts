import api from './axiosInstance';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Submission {
  id: number;
  userId: number;
  title: string;
  description?: string;
  fileOriginalName: string;
  fileStoragePath: string;
  fileMimeType: string;
  fileSizeBytes: number;
  status: SubmissionStatus;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const res = await api.get('/api/submissions');
  return res.data.data;
}

export async function fetchSubmission(id: number): Promise<Submission> {
  const res = await api.get(`/api/submissions/${id}`);
  return res.data.data;
}

export interface CreateSubmissionPayload {
  title: string;
  description?: string;
  file: File;
}

export async function createSubmission(payload: CreateSubmissionPayload): Promise<Submission> {
  const formData = new FormData();
  formData.append('title', payload.title);
  if (payload.description) {
    formData.append('description', payload.description);
  }
  formData.append('file', payload.file);

  const res = await api.post('/api/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data.data;
}

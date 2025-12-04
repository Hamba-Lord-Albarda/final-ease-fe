import api from './axiosInstance';
import { Submission } from './submissions';

export async function approveSubmission(id: number): Promise<Submission> {
  const res = await api.post(`/api/process/submissions/${id}/approve`, {});
  return res.data.data;
}

export async function rejectSubmission(id: number, reason: string): Promise<Submission> {
  const res = await api.post(`/api/process/submissions/${id}/reject`, { reason });
  return res.data.data;
}

import type { Content } from './types';
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Сервис временно недоступен' }));
    throw new Error(data.error || 'Ошибка запроса');
  }
  return response.json() as Promise<T>;
}
const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
export const api = {
  content: (signal?: AbortSignal) => request<Content>('/api/content', { signal }),
  login: (token: string) => request('/api/admin/session', { headers: auth(token) }),
  save: (token: string, content: Content) =>
    request<Content>('/api/admin/content', {
      method: 'PUT',
      headers: { ...auth(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    }),
  upload: (token: string, file: File) =>
    request<{ url: string }>('/api/admin/uploads', {
      method: 'POST',
      headers: { ...auth(token), 'Content-Type': file.type },
      body: file,
    }),
};

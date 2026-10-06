import { lazy, Suspense, useEffect, useState } from 'react';
import { api } from '../shared/api/client';
import type { Content } from '../shared/api/types';
import { Site } from '../features/site/Site';
const Admin = lazy(() => import('../features/admin/Admin'));
export function App() {
  const [content, setContent] = useState<Content>();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    api
      .content(controller.signal)
      .then(setContent)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      });
    return () => controller.abort();
  }, [attempt]);
  if (error)
    return (
      <main className="load-screen">
        <span className="wordmark">M96</span>
        <h1>Небольшая пауза</h1>
        <p>{error}</p>
        <button className="button" onClick={() => setAttempt((v) => v + 1)}>
          Попробовать ещё раз
        </button>
      </main>
    );
  if (!content)
    return (
      <main className="load-screen" aria-busy="true">
        <span className="wordmark">M96</span>
        <p>Готовим ваше пространство…</p>
      </main>
    );
  return location.pathname.startsWith('/admin') ? (
    <Suspense fallback={<p className="load-screen">Загрузка редактора…</p>}>
      <Admin initial={content} />
    </Suspense>
  ) : (
    <Site content={content} />
  );
}

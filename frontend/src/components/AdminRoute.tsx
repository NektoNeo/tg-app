import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking');
  useEffect(() => {
    if (!sessionStorage.getItem('adminToken')) {
      setState('denied');
      return;
    }
    const controller = new AbortController();
    api.get('/admin/session', { signal: controller.signal }).then(
      () => { if (!controller.signal.aborted) setState('allowed'); },
      () => { if (!controller.signal.aborted) setState('denied'); },
    );
    return () => controller.abort();
  }, []);
  if (state === 'checking') return <p role="status">Проверяем доступ…</p>;
  if (state === 'denied') return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

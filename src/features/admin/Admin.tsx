import { SettingsEditor } from './editors/SettingsEditor';
import { ContactsEditor } from './editors/ContactsEditor';
import { MastersEditor } from './editors/MastersEditor';
import { BenefitsEditor } from './editors/BenefitsEditor';
import { GalleryEditor } from './editors/GalleryEditor';
import { ServicesEditor } from './editors/ServicesEditor';
import { GeneralEditor } from './editors/GeneralEditor';
import { useEffect, useState, type FormEvent } from 'react';
import type { Content } from '../../shared/api/types';
import { api } from '../../shared/api/client';
import './admin.css';
export default function Admin({ initial }: { initial: Content }) {
  const [token, setToken] = useState('');
  const [key, setKey] = useState('');
  const [data, setData] = useState<Content>(initial);
  const [tab, setTab] = useState('Основное');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    document.title = 'Редактор — M96';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.append(meta);
    }
    meta.content = 'noindex,nofollow';
  }, []);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const change = (next: Content) => {
    setData(next);
    setDirty(true);
    setNotice('');
    setError('');
  };
  const section = <K extends 'hero' | 'about' | 'contact' | 'settings'>(
    name: K,
    field: keyof Content[K],
    value: string,
  ) => change({ ...data, [name]: { ...data[name], [field]: value } });
  async function login(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(key);
      setData(await api.content());
      setToken(key);
      setKey('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const saved = await api.save(token, data);
      setData(saved);
      setDirty(false);
      setNotice('Изменения опубликованы. Сайт обновлён.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!token)
    return (
      <main className="admin-login">
        <a className="brand" href="/">
          M96<span>УПРАВЛЕНИЕ САЙТОМ</span>
        </a>
        <form onSubmit={login}>
          <p className="eyebrow">Для команды пространства</p>
          <h1>Вход в редактор</h1>
          <p>Введите ключ доступа, заданный при настройке сервера.</p>
          <label className="admin-field">
            <span>Ключ доступа</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </label>
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? 'Проверяем…' : 'Войти'}
          </button>
          <a className="back-link" href="/">
            ← Вернуться на сайт
          </a>
        </form>
      </main>
    );
  const tabs = [
    'Основное',
    'Услуги',
    'Интерьер',
    'Преимущества',
    'Мастера',
    'Контакты',
    'Интеграции и SEO',
  ];
  return (
    <div className="admin">
      <header className="admin-header">
        <a className="brand" href="/" target="_blank" rel="noreferrer">
          M96<span>РЕДАКТОР</span>
        </a>
        <div>
          <span>{dirty ? 'Есть неопубликованные изменения' : `Версия ${data.revision}`}</span>
          <a href="/" target="_blank" rel="noreferrer">
            Открыть сайт ↗
          </a>
          <button
            onClick={() => {
              if (!dirty || confirm('Выйти без сохранения изменений?')) {
                setToken('');
                setData(initial);
                setDirty(false);
              }
            }}
          >
            Выйти
          </button>
        </div>
      </header>
      <aside className="admin-sidebar">
        <p className="eyebrow">Содержание сайта</p>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={t === tab ? 'active' : ''}>
            {t}
            <span>↗</span>
          </button>
        ))}
        <p>
          Фотографии, мастера и цены в стартовой версии — демонстрационные. Замените их перед
          запуском.
        </p>
      </aside>
      <main className="admin-main">
        <p className="eyebrow">Управление контентом / M96</p>
        <h1>{tab}</h1>
        <fieldset disabled={busy} className="editor-fields">
          {tab === 'Основное' && (
            <GeneralEditor data={data} change={change} token={token} section={section} />
          )}
          {tab === 'Услуги' && (
            <ServicesEditor data={data} change={change} token={token} section={section} />
          )}
          {tab === 'Интерьер' && (
            <GalleryEditor data={data} change={change} token={token} section={section} />
          )}
          {tab === 'Преимущества' && (
            <BenefitsEditor data={data} change={change} token={token} section={section} />
          )}
          {tab === 'Мастера' && (
            <MastersEditor data={data} change={change} token={token} section={section} />
          )}
          {tab === 'Контакты' && (
            <ContactsEditor data={data} change={change} token={token} section={section} />
          )}
          {tab === 'Интеграции и SEO' && (
            <SettingsEditor data={data} change={change} token={token} section={section} />
          )}
        </fieldset>
      </main>
      <div className="admin-publish-bar" aria-label="Публикация изменений">
        <div aria-live="polite">
          {error ? (
            <p className="publish-error" role="alert">
              {error}
            </p>
          ) : (
            <p>
              {notice || (dirty ? 'Изменения ещё не опубликованы' : 'Все изменения опубликованы')}
            </p>
          )}
          <small>После редактирования нажмите «Опубликовать», чтобы обновить сайт.</small>
        </div>
        <button className="button" disabled={busy || !dirty} onClick={() => void save()}>
          {busy ? 'Сохраняем…' : 'Опубликовать'}
        </button>
      </div>
    </div>
  );
}

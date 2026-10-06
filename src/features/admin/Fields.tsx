import { useRef, useState } from 'react';
import { api } from '../../shared/api/client';
type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
};
export function Field({ label, value, onChange, multiline = false, type = 'text' }: FieldProps) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
export function ImageField({
  label,
  value,
  onChange,
  token,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  token: string;
}) {
  const latestOnChange = useRef(onChange);
  latestOnChange.current = onChange;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function upload(file: File) {
    setError('');
    if (file.size > 8 * 1024 * 1024) {
      setError('Файл должен быть меньше 8 МБ');
      return;
    }
    setBusy(true);
    try {
      const result = await api.upload(token, file);
      latestOnChange.current(result.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="image-field">
      <img src={value} alt="Предпросмотр" />
      <div>
        <Field label={label} value={value} onChange={onChange} />
        <label className="upload-label">
          {busy ? 'Загрузка…' : 'Загрузить фотографию'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = '';
            }}
          />
        </label>
        <small>
          JPEG, PNG, WebP · до 8 МБ. Загрузка добавляет файл; опубликуйте изменения, чтобы показать
          его на сайте.
        </small>
        {error && <p role="alert">{error}</p>}
      </div>
    </div>
  );
}

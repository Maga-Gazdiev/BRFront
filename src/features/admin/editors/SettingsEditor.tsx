import type { EditorProps } from './types';
import { Field } from '../Fields';
import type { Content } from '../../../shared/api/types';
export function SettingsEditor({ data, section }: EditorProps) {
  return (
    <div className="admin-card">
      <p className="admin-hint">
        YCLIENTS открывается в новой вкладке. Метрика загружается только после согласия посетителя.
        Не указывайте здесь приватные API-ключи.
      </p>
      {(Object.keys(data.settings) as (keyof Content['settings'])[]).map((k) => (
        <Field
          key={k}
          label={
            {
              bookingUrl: 'Ссылка на запись YCLIENTS',
              metrikaId: 'Номер счётчика Яндекс Метрики',
              siteUrl: 'Публичный адрес сайта (https://…)',
              title: 'SEO title',
              description: 'SEO description',
              privacyText: 'Политика конфиденциальности',
            }[k]
          }
          multiline={k === 'description' || k === 'privacyText'}
          value={data.settings[k]}
          onChange={(v) => section('settings', k, v)}
        />
      ))}
    </div>
  );
}

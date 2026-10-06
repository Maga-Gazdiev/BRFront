import type { EditorProps } from './types';
import { Field } from '../Fields';
import type { Content } from '../../../shared/api/types';
export function ContactsEditor({ data, section }: EditorProps) {
  return (
    <div className="admin-card">
      <p className="admin-hint">
        Пустые контакты не показываются на сайте. Для карты скопируйте src iframe из Яндекс Карт
        (https://yandex.ru/map-widget/…).
      </p>
      {(Object.keys(data.contact) as (keyof Content['contact'])[]).map((k) => (
        <Field
          key={k}
          label={
            {
              address: 'Адрес',
              phone: 'Телефон',
              hours: 'Часы работы',
              telegram: 'Telegram — https://t.me/…',
              vk: 'ВКонтакте — https://vk.com/…',
              mapUrl: 'URL виджета Яндекс Карт',
              routeUrl: 'Ссылка на маршрут',
            }[k]
          }
          value={data.contact[k]}
          onChange={(v) => section('contact', k, v)}
        />
      ))}
    </div>
  );
}

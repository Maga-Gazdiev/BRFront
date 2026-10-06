import type { EditorProps } from './types';
import { Field } from '../Fields';
export function ServicesEditor({ data, change }: EditorProps) {
  return (
    <>
      <p className="admin-hint">
        Категории на сайте формируются автоматически. Цена указывается в рублях.
      </p>
      {data.services.map((s, i) => (
        <div className="admin-card" key={s.id}>
          <div className="card-heading">
            <h2>{s.name || 'Новая услуга'}</h2>
            <button
              className="delete-button"
              onClick={() => change({ ...data, services: data.services.filter((_, j) => i !== j) })}
            >
              Удалить услугу
            </button>
          </div>
          <div className="field-grid">
            {(['name', 'category', 'description'] as const).map((k) => (
              <Field
                key={k}
                label={
                  {
                    name: 'Название услуги',
                    category: 'Категория',
                    description: 'Описание услуги',
                  }[k]
                }
                value={s[k]}
                onChange={(v) =>
                  change({
                    ...data,
                    services: data.services.map((item, j) =>
                      i === j ? { ...item, [k]: v } : item,
                    ),
                  })
                }
              />
            ))}
            {(['price', 'duration'] as const).map((k) => (
              <Field
                key={k}
                label={k === 'price' ? 'Цена, ₽' : 'Длительность, мин'}
                type="number"
                value={String(s[k])}
                onChange={(v) =>
                  change({
                    ...data,
                    services: data.services.map((item, j) =>
                      i === j ? { ...item, [k]: Number(v) } : item,
                    ),
                  })
                }
              />
            ))}
          </div>
        </div>
      ))}
      <button
        className="button"
        onClick={() =>
          change({
            ...data,
            services: [
              ...data.services,
              {
                id: crypto.randomUUID(),
                category: 'Барбер',
                name: 'Новая услуга',
                description: '',
                price: 0,
                duration: 60,
              },
            ],
          })
        }
      >
        + Добавить услугу
      </button>
    </>
  );
}

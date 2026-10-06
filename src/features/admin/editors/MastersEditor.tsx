import type { EditorProps } from './types';
import { Field, ImageField } from '../Fields';
export function MastersEditor({ data, change, token }: EditorProps) {
  return (
    <>
      {data.masters.map((m, i) => (
        <div className="admin-card" key={i}>
          <div className="card-heading">
            <h2>{m.name || 'Новый мастер'}</h2>
            <button
              className="delete-button"
              onClick={() => change({ ...data, masters: data.masters.filter((_, j) => i !== j) })}
            >
              Удалить мастера
            </button>
          </div>
          {(['name', 'role', 'description'] as const).map((k) => (
            <Field
              key={k}
              label={{ name: 'Имя', role: 'Специализация', description: 'О мастере' }[k]}
              value={m[k]}
              onChange={(v) =>
                change({
                  ...data,
                  masters: data.masters.map((item, j) => (i === j ? { ...item, [k]: v } : item)),
                })
              }
            />
          ))}
          <ImageField
            label="Фото мастера"
            value={m.image}
            token={token}
            onChange={(v) =>
              change({
                ...data,
                masters: data.masters.map((item, j) => (i === j ? { ...item, image: v } : item)),
              })
            }
          />
        </div>
      ))}
      <button
        className="button"
        onClick={() =>
          change({
            ...data,
            masters: [
              ...data.masters,
              { name: 'Новый мастер', role: '', description: '', image: data.about.image },
            ],
          })
        }
      >
        + Добавить мастера
      </button>
    </>
  );
}

import type { EditorProps } from './types';
import { Field } from '../Fields';
export function BenefitsEditor({ data, change }: EditorProps) {
  return (
    <>
      {data.benefits.map((b, i) => (
        <div className="admin-card" key={i}>
          <div className="card-heading">
            <h2>Преимущество {i + 1}</h2>
            <button
              className="delete-button"
              onClick={() => change({ ...data, benefits: data.benefits.filter((_, j) => i !== j) })}
            >
              Удалить
            </button>
          </div>
          {(['title', 'description'] as const).map((k) => (
            <Field
              key={k}
              label={k === 'title' ? 'Название преимущества' : 'Описание преимущества'}
              multiline={k === 'description'}
              value={b[k]}
              onChange={(v) =>
                change({
                  ...data,
                  benefits: data.benefits.map((item, j) => (i === j ? { ...item, [k]: v } : item)),
                })
              }
            />
          ))}
        </div>
      ))}
      <button
        className="button"
        onClick={() =>
          change({
            ...data,
            benefits: [...data.benefits, { title: 'Новое преимущество', description: '' }],
          })
        }
      >
        + Добавить преимущество
      </button>
    </>
  );
}

import type { EditorProps } from './types';
import { Field, ImageField } from '../Fields';
export function GalleryEditor({ data, change, token }: EditorProps) {
  return (
    <>
      {data.gallery.map((p, i) => (
        <div className="admin-card" key={i}>
          <div className="card-heading">
            <h2>Фотография {i + 1}</h2>
            <div>
              <button
                disabled={i === 0}
                onClick={() => {
                  const gallery = [...data.gallery];
                  [gallery[i - 1], gallery[i]] = [gallery[i], gallery[i - 1]];
                  change({ ...data, gallery });
                }}
              >
                ↑ Выше
              </button>{' '}
              <button
                className="delete-button"
                onClick={() => change({ ...data, gallery: data.gallery.filter((_, j) => i !== j) })}
              >
                Удалить фото
              </button>
            </div>
          </div>
          <ImageField
            label="Фотография интерьера"
            value={p.image}
            token={token}
            onChange={(v) =>
              change({
                ...data,
                gallery: data.gallery.map((item, j) => (i === j ? { ...item, image: v } : item)),
              })
            }
          />
          <Field
            label="Подпись к фото"
            value={p.caption}
            onChange={(v) =>
              change({
                ...data,
                gallery: data.gallery.map((item, j) => (i === j ? { ...item, caption: v } : item)),
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
            gallery: [...data.gallery, { image: data.hero.image, caption: 'Новая фотография' }],
          })
        }
      >
        + Добавить фотографию
      </button>
    </>
  );
}

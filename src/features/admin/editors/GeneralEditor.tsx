import type { EditorProps } from './types';
import { Field, ImageField } from '../Fields';
export function GeneralEditor({ data, change, token, section }: EditorProps) {
  return (
    <>
      <div className="admin-card">
        <h2>Бренд</h2>
        <Field
          label="Название"
          value={data.brand}
          onChange={(v) => change({ ...data, brand: v })}
        />
        <Field label="Город" value={data.city} onChange={(v) => change({ ...data, city: v })} />
      </div>
      <div className="admin-card">
        <h2>Главный экран</h2>
        <Field
          label="Надпись над заголовком"
          value={data.hero.eyebrow}
          onChange={(v) => section('hero', 'eyebrow', v)}
        />
        <Field
          label="Заголовок"
          multiline
          value={data.hero.title}
          onChange={(v) => section('hero', 'title', v)}
        />
        <Field
          label="Описание"
          multiline
          value={data.hero.description}
          onChange={(v) => section('hero', 'description', v)}
        />
        <ImageField
          label="Фото главного экрана"
          value={data.hero.image}
          token={token}
          onChange={(v) => section('hero', 'image', v)}
        />
      </div>
      <div className="admin-card">
        <h2>О пространстве</h2>
        <Field
          label="Заголовок раздела"
          multiline
          value={data.about.title}
          onChange={(v) => section('about', 'title', v)}
        />
        <Field
          label="Текст о пространстве"
          multiline
          value={data.about.description}
          onChange={(v) => section('about', 'description', v)}
        />
        <ImageField
          label="Фото пространства"
          value={data.about.image}
          token={token}
          onChange={(v) => section('about', 'image', v)}
        />
      </div>
    </>
  );
}

import type { Content } from '../../shared/api/types';
import { Arrow } from '../../shared/ui/Arrow';
export function InteriorSection({
  content: c,
  onPhoto: setPhoto,
}: {
  content: Content;
  onPhoto: (index: number) => void;
}) {
  return (
    <section className="interior section" id="interior">
      <div className="container section-heading reveal">
        <div>
          <p className="eyebrow">03 / Атмосфера</p>
          <h2>
            Вне городского
            <br />
            шума.
          </h2>
        </div>
        <p className="section-intro">
          Тёплый свет. Продуманные детали.
          <br />
          Пространство, в котором хочется остаться.
        </p>
      </div>
      <div className="gallery">
        {c.gallery.map((p, i) => (
          <button
            className="gallery-item"
            key={i}
            onClick={() => setPhoto(i)}
            aria-label={`Открыть фото: ${p.caption}`}
          >
            <img src={p.image} alt={p.caption} loading="lazy" width="1100" height="800" />
            <span>
              <b>{String(i + 1).padStart(2, '0')}</b>
              {p.caption}
              <Arrow />
            </span>
          </button>
        ))}
      </div>
      <div className="container gallery-note">
        <span>Почувствуйте себя на своём месте.</span>
        <span>Нажмите на фото, чтобы рассмотреть</span>
      </div>
    </section>
  );
}

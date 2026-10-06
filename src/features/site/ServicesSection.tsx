import type { Content, Service } from '../../shared/api/types';
import { Arrow } from '../../shared/ui/Arrow';
import { useState } from 'react';
import { money } from '../../shared/format';
export function ServicesSection({
  content: c,
  onBook: book,
}: {
  content: Content;
  onBook: (service: Service) => void;
}) {
  const [category, setCategory] = useState('Все услуги');
  const categories = ['Все услуги', ...new Set(c.services.map((s) => s.category))];
  return (
    <section className="services section" id="services">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">02 / Услуги и стоимость</p>
            <h2>
              Внимание к себе.
              <br />
              <span className="muted">В каждой детали.</span>
            </h2>
          </div>
          <p className="section-intro">
            От привычного ритуала до полной перезагрузки.
            <br />
            Выберите то, что нужно сегодня.
          </p>
        </div>
        <div className="service-tabs" role="group" aria-label="Категории услуг">
          {categories.map((cat) => (
            <button
              key={cat}
              aria-pressed={cat === category}
              className={cat === category ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="service-list">
          {c.services
            .filter((s) => category === 'Все услуги' || s.category === category)
            .map((s, i) => (
              <article className="service-row" key={s.id}>
                <span className="service-number">{String(i + 1).padStart(2, '0')}</span>
                <div className="service-copy">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                </div>
                <span className="duration">{s.duration} мин</span>
                <span className="price">{money(s.price)} ₽</span>
                <button
                  className="round-button"
                  aria-label={`Записаться: ${s.name}`}
                  onClick={() => book(s)}
                >
                  <Arrow />
                </button>
              </article>
            ))}
        </div>
        <p className="fine-print">Точную продолжительность процедуры можно уточнить при записи.</p>
      </div>
    </section>
  );
}

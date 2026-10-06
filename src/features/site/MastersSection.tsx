import type { Content } from '../../shared/api/types';
import { Arrow } from '../../shared/ui/Arrow';
export function MastersSection({
  content: c,
  onBook: book,
}: {
  content: Content;
  onBook: () => void;
}) {
  return (
    <section className="masters section" id="masters">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">05 / Команда</p>
            <h2>
              Люди, которым
              <br />
              доверяют.
            </h2>
          </div>
          <p className="section-intro">
            Мастерство — в результате.
            <br />
            Забота — в отношении.
          </p>
        </div>
        <div className="master-grid">
          {c.masters.map((m, i) => (
            <article className="master-card" key={i}>
              <div className="master-image">
                <img src={m.image} alt={m.name} loading="lazy" width="600" height="750" />
                <button
                  className="round-button"
                  aria-label={`Записаться к мастеру ${m.name}`}
                  onClick={() => book()}
                >
                  <Arrow />
                </button>
              </div>
              <div className="master-title">
                <h3>{m.name}</h3>
                <span>{m.role}</span>
              </div>
              <p>{m.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

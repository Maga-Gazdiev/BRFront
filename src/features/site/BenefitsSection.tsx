import type { Content } from '../../shared/api/types';
export function BenefitsSection({ content: c }: { content: Content }) {
  return (
    <section className="benefits section container reveal">
      <p className="eyebrow">04 / Философия M96</p>
      <div className="benefits-layout">
        <h2>
          Хороший сервис
          <br />
          чувствуется.
          <br />
          <span className="muted">Без объяснений.</span>
        </h2>
        <div className="benefit-grid">
          {c.benefits.map((b, i) => (
            <article key={i}>
              <span className="benefit-number">/{String(i + 1).padStart(2, '0')}</span>
              <h3>{b.title}</h3>
              <p>{b.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

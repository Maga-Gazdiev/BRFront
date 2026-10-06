import type { Content } from '../../shared/api/types';
import { Arrow } from '../../shared/ui/Arrow';
export function AboutSection({ content: c }: { content: Content }) {
  return (
    <section className="about section container reveal" id="about">
      <div className="section-side">
        <p className="eyebrow">01 / О пространстве</p>
        <div className="about-mark" aria-hidden="true">
          M<span>96</span>
          <small>MEN’S SPACE</small>
        </div>
      </div>
      <div className="about-copy">
        <h2>{c.about.title}</h2>
        <p>{c.about.description}</p>
        <a className="text-link" href="#services">
          Найти свой ритуал <Arrow />
        </a>
      </div>
      <figure className="about-photo">
        <img
          src={c.about.image}
          alt="Детали профессионального ухода"
          loading="lazy"
          width="700"
          height="850"
        />
        <figcaption>Детали создают ощущение.</figcaption>
      </figure>
    </section>
  );
}

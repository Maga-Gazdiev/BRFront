import type { Content } from '../../shared/api/types';
import { Arrow } from '../../shared/ui/Arrow';
export function ContactSection({ content: c }: { content: Content }) {
  return (
    <section className="contacts section container" id="contacts">
      <div className="contact-copy">
        <p className="eyebrow">07 / Контакты</p>
        <h2>
          До встречи
          <br />в {c.brand}.
        </h2>
        <p className="contact-city">{c.city}</p>
        <p>{c.contact.address || 'Адрес пространства скоро появится здесь.'}</p>
        {c.contact.hours && <p className="contact-hours">{c.contact.hours}</p>}
        {c.contact.phone && (
          <a className="phone" href={`tel:${c.contact.phone.replace(/[^+\d]/g, '')}`}>
            {c.contact.phone}
          </a>
        )}
        <div className="socials">
          {c.contact.telegram && (
            <a href={c.contact.telegram} target="_blank" rel="noreferrer">
              Telegram <Arrow />
            </a>
          )}
          {c.contact.vk && (
            <a href={c.contact.vk} target="_blank" rel="noreferrer">
              ВКонтакте <Arrow />
            </a>
          )}
        </div>
        {c.contact.routeUrl && (
          <a className="text-link" href={c.contact.routeUrl} target="_blank" rel="noreferrer">
            {c.contact.address ? 'Построить маршрут' : 'Екатеринбург на карте'} <Arrow />
          </a>
        )}
      </div>
      <div className="map">
        {c.contact.mapUrl ? (
          <iframe
            title="M96 на карте"
            src={c.contact.mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="map-placeholder">
            <div className="map-grid" />
            <span className="map-pin">M96</span>
            <p>Екатеринбург</p>
            <span>Точный адрес — скоро</span>
          </div>
        )}
      </div>
    </section>
  );
}

import { ContactSection } from './ContactSection';
import { MastersSection } from './MastersSection';
import { BenefitsSection } from './BenefitsSection';
import { InteriorSection } from './InteriorSection';
import { ServicesSection } from './ServicesSection';
import { AboutSection } from './AboutSection';
import { useState } from 'react';
import type { Content, Service } from '../../shared/api/types';
import { Dialog } from '../../shared/ui/Dialog';
import { useSiteEffects } from './useSiteEffects';
import { Arrow } from '../../shared/ui/Arrow';
import { money } from '../../shared/format';
function readConsent() {
  try {
    return localStorage.getItem('m96-analytics');
  } catch {
    return null;
  }
}
export function Site({ content: c }: { content: Content }) {
  const [menu, setMenu] = useState(false);
  const [booking, setBooking] = useState<Service | null | undefined>();
  const [photo, setPhoto] = useState<number>();
  const [privacy, setPrivacy] = useState(false);
  const [consent, setConsent] = useState<string | null>(readConsent);
  useSiteEffects(c, consent === 'yes');
  const consentTo = (value: string) => {
    try {
      localStorage.setItem('m96-analytics', value);
    } catch {
      /* Storage may be unavailable. */
    }
    setConsent(value);
  };
  const navigation = [
    ['about', 'О пространстве'],
    ['services', 'Услуги'],
    ['interior', 'Интерьер'],
    ['masters', 'Мастера'],
    ['contacts', 'Контакты'],
  ];
  const book = (s: Service | null = null) => {
    setMenu(false);
    setBooking(s);
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>
      <header className="header">
        <a className="brand" href="#" aria-label={`${c.brand} — главная`}>
          {c.brand}
          <span>МУЖСКОЕ ПРОСТРАНСТВО</span>
        </a>
        <nav aria-label="Основная навигация">
          {navigation.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <button className="header-book" onClick={() => book()}>
          <span>Записаться</span>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12 12 4M4 4h8v8" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        <button
          className="menu-toggle icon-button"
          aria-label="Открыть меню"
          onClick={() => setMenu(true)}
        >
          <span />
          <span />
        </button>
      </header>
      <main id="main">
        <section className="hero">
          <img
            className="hero-image"
            src={c.hero.image}
            alt="Атмосфера мужского пространства"
            fetchPriority="high"
            width="1800"
            height="1200"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">
              <span className="small-line" />
              {c.hero.eyebrow}
            </p>
            <h1>{c.hero.title}</h1>
            <p className="hero-description">{c.hero.description}</p>
            <button className="button" onClick={() => book()}>
              Выбрать время <Arrow />
            </button>
          </div>
          <div className="hero-bottom">
            <span>
              МАНИКЮР &nbsp; / &nbsp; ПЕДИКЮР &nbsp; / &nbsp; МАССАЖ &nbsp; / &nbsp; БАРБЕР
            </span>
            <a href="#about">
              Листайте, чтобы почувствовать <span>↓</span>
            </a>
          </div>
          <span className="hero-index" aria-hidden="true">
            01 — 08
          </span>
        </section>
        <AboutSection content={c} />
        <ServicesSection content={c} onBook={book} />
        <InteriorSection content={c} onPhoto={setPhoto} />
        <BenefitsSection content={c} />
        <MastersSection content={c} onBook={() => book()} />
        <section className="booking-section container reveal" id="booking">
          <p className="eyebrow">06 / Время для себя</p>
          <div>
            <h2>
              В вашем расписании
              <br />
              есть место <em>для вас.</em>
            </h2>
            <button className="button" onClick={() => book()}>
              Записаться в M96 <Arrow />
            </button>
          </div>
          <p>Выберите удобное время. Об остальном позаботимся мы.</p>
        </section>
        <ContactSection content={c} />
      </main>
      <footer className="footer container">
        <div className="footer-top">
          <a className="brand" href="#">
            {c.brand}
            <span>МУЖСКОЕ ПРОСТРАНСТВО</span>
          </a>
          <p>Ваше время. Ваше пространство.</p>
          <a href="#">Наверх ↑</a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {c.brand}
          </span>
          <button onClick={() => setPrivacy(true)}>Политика конфиденциальности</button>
          {c.settings.metrikaId && (
            <button onClick={() => setConsent(null)}>Настройки аналитики</button>
          )}
          <span>{c.city}</span>
        </div>
      </footer>
      <div className="mobile-book">
        <button className="button" onClick={() => book()}>
          Записаться <Arrow />
        </button>
      </div>
      {menu && (
        <Dialog title="Навигация" onClose={() => setMenu(false)} className="menu-dialog">
          <a className="brand" href="#" onClick={() => setMenu(false)}>
            {c.brand}
          </a>
          <nav>
            {navigation.map(([id, label], i) => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
                <small>0{i + 1}</small>
                {label}
                <Arrow />
              </a>
            ))}
          </nav>
          <button className="button" onClick={() => book()}>
            Выбрать время <Arrow />
          </button>
        </Dialog>
      )}
      {booking !== undefined && (
        <Dialog title="Онлайн-запись" onClose={() => setBooking(undefined)}>
          <p className="eyebrow">M96 / Онлайн-запись</p>
          <h2>
            Ваш следующий
            <br />
            хороший час.
          </h2>
          {booking && (
            <div className="booking-summary">
              <h3>{booking.name}</h3>
              <p>
                {booking.duration} мин · {money(booking.price)} ₽
              </p>
            </div>
          )}
          {c.settings.bookingUrl ? (
            <>
              <p>Выберите услугу, мастера и удобное время в YCLIENTS.</p>
              <a className="button" href={c.settings.bookingUrl} target="_blank" rel="noreferrer">
                Перейти к записи <Arrow />
              </a>
            </>
          ) : (
            <>
              <p>
                Онлайн-запись скоро откроется.
                {c.contact.phone
                  ? ' Пока можно связаться с нами по телефону.'
                  : ' Пожалуйста, загляните чуть позже.'}
              </p>
              {c.contact.phone && (
                <a className="button" href={`tel:${c.contact.phone.replace(/[^+\d]/g, '')}`}>
                  Позвонить <Arrow />
                </a>
              )}
            </>
          )}
        </Dialog>
      )}
      {photo !== undefined && c.gallery[photo] && (
        <Dialog
          title={c.gallery[photo].caption}
          onClose={() => setPhoto(undefined)}
          className="photo-dialog"
        >
          <img src={c.gallery[photo].image} alt={c.gallery[photo].caption} />
          <div className="photo-controls">
            <button
              className="icon-button"
              aria-label="Предыдущее фото"
              onClick={() => setPhoto((photo - 1 + c.gallery.length) % c.gallery.length)}
            >
              ←
            </button>
            <p>
              {c.gallery[photo].caption} · {photo + 1}/{c.gallery.length}
            </p>
            <button
              className="icon-button"
              aria-label="Следующее фото"
              onClick={() => setPhoto((photo + 1) % c.gallery.length)}
            >
              →
            </button>
          </div>
        </Dialog>
      )}
      {privacy && (
        <Dialog title="Политика конфиденциальности" onClose={() => setPrivacy(false)}>
          <p className="eyebrow">M96</p>
          <h2>Конфиденциальность</h2>
          <p className="privacy-text">{c.settings.privacyText}</p>
        </Dialog>
      )}
      {c.settings.metrikaId && consent === null && (
        <aside className="cookie-banner" aria-label="Согласие на аналитику">
          <p>
            Разрешить Яндекс Метрику для улучшения сайта? Без согласия аналитика не загружается.
          </p>
          <button onClick={() => consentTo('no')}>Отклонить</button>
          <button className="button" onClick={() => consentTo('yes')}>
            Разрешить
          </button>
        </aside>
      )}
    </>
  );
}

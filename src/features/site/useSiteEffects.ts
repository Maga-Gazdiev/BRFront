import { useEffect } from 'react';
import type { Content } from '../../shared/api/types';
declare global {
  interface Window {
    ym?: ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
  }
}
export function useSiteEffects(content: Content, analytics: boolean) {
  useEffect(() => {
    document.title = content.settings.title;
    const meta = (key: string, value: string, property = false) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[${property ? 'property' : 'name'}="${key}"]`,
      );
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(property ? 'property' : 'name', key);
        document.head.append(el);
      }
      el.content = value;
    };
    meta('description', content.settings.description);
    meta('og:title', content.settings.title, true);
    meta('og:description', content.settings.description, true);
    if (content.settings.siteUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.append(link);
      }
      link.href = content.settings.siteUrl;
      meta('og:url', content.settings.siteUrl, true);
      meta('og:image', new URL(content.hero.image, content.settings.siteUrl).href, true);
    }
  }, [content]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('will-reveal');
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!analytics || !content.settings.metrikaId) return;
    const id = Number(content.settings.metrikaId);
    if (!window.ym) {
      const ym: NonNullable<Window['ym']> = (...args) => {
        (ym.a ??= []).push(args);
      };
      ym.l = Date.now();
      window.ym = ym;
    }
    const script = document.createElement('script');
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.async = true;
    document.head.append(script);
    window.ym(id, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    });
    return () => {
      window.ym?.(id, 'destruct');
      script.remove();
    };
  }, [analytics, content.settings.metrikaId]);
}

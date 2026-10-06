export interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}
export interface Photo {
  image: string;
  caption: string;
}
export interface Master {
  name: string;
  role: string;
  description: string;
  image: string;
}
export interface Content {
  revision: number;
  brand: string;
  city: string;
  hero: { eyebrow: string; title: string; description: string; image: string };
  about: { title: string; description: string; image: string };
  services: Service[];
  gallery: Photo[];
  benefits: { title: string; description: string }[];
  masters: Master[];
  contact: {
    address: string;
    phone: string;
    hours: string;
    telegram: string;
    vk: string;
    mapUrl: string;
    routeUrl: string;
  };
  settings: {
    bookingUrl: string;
    metrikaId: string;
    siteUrl: string;
    title: string;
    description: string;
    privacyText: string;
  };
}

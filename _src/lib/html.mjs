/** Kleine, reine Helfer für HTML-Ausgabe (keine Seiteneffekte). */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Wandelt Text in einen URL-Anker ohne Umlaute/Leerzeichen um. */
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const srcset = (set, ext) =>
  set.widths.map((w) => `/assets/img/${set.dir}/${set.name}-${w}.${ext} ${w}w`).join(', ');

export const imgUrl = (set, width, ext = 'jpg') => `/assets/img/${set.dir}/${set.name}-${width}.${ext}`;

/**
 * <picture> mit AVIF, WebP und JPG-Fallback.
 * Bilder oberhalb des Falzes: priority=true (kein lazy, fetchpriority=high).
 */
export function picture(set, { alt, sizes, priority = false, className = '', imgClass = '' }) {
  if (alt === undefined) throw new Error(`Alt-Text fehlt für ${set.name}`);
  const fallbackWidth = set.widths.find((w) => w >= 768) ?? set.widths.at(-1);
  const loading = priority ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<picture${className ? ` class="${className}"` : ''}>
  <source type="image/avif" srcset="${srcset(set, 'avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${srcset(set, 'webp')}" sizes="${sizes}">
  <img${imgClass ? ` class="${imgClass}"` : ''} src="${imgUrl(set, fallbackWidth)}" srcset="${srcset(set, 'jpg')}" sizes="${sizes}" alt="${esc(alt)}" width="${set.width}" height="${set.height}" ${loading} decoding="async">
</picture>`;
}

/** Art-Direction: unterschiedliche Bildsets je Breakpoint (Hero). */
export function artPicture({ wide, tall, alt, breakpoint, wideSizes, tallSizes, decorative = false }) {
  const mq = `(min-width: ${breakpoint}px)`;
  // Dekorative Kopie (z. B. Schmutz-Ebene): gleiche URLs -> kein zweiter Download, keine Priorität
  const priority = decorative ? '' : ' fetchpriority="high"';
  const altText = decorative ? '' : esc(alt);
  return `<picture>
  <source media="${mq}" type="image/avif" srcset="${srcset(tall, 'avif')}" sizes="${tallSizes}">
  <source media="${mq}" type="image/webp" srcset="${srcset(tall, 'webp')}" sizes="${tallSizes}">
  <source media="${mq}" srcset="${srcset(tall, 'jpg')}" sizes="${tallSizes}">
  <source type="image/avif" srcset="${srcset(wide, 'avif')}" sizes="${wideSizes}">
  <source type="image/webp" srcset="${srcset(wide, 'webp')}" sizes="${wideSizes}">
  <img src="${imgUrl(wide, 768)}" srcset="${srcset(wide, 'jpg')}" sizes="${wideSizes}" alt="${altText}" width="${wide.width}" height="${wide.height}"${priority} decoding="async">
</picture>`;
}

export const preloadArt = ({ wide, tall, breakpoint, wideSizes, tallSizes }) =>
  `<link rel="preload" as="image" type="image/avif" media="(max-width: ${breakpoint - 1}px)" imagesrcset="${srcset(wide, 'avif')}" imagesizes="${wideSizes}" fetchpriority="high">
  <link rel="preload" as="image" type="image/avif" media="(min-width: ${breakpoint}px)" imagesrcset="${srcset(tall, 'avif')}" imagesizes="${tallSizes}" fetchpriority="high">`;

export const preloadPicture = (set, sizes) =>
  `<link rel="preload" as="image" type="image/avif" imagesrcset="${srcset(set, 'avif')}" imagesizes="${sizes}" fetchpriority="high">`;

const svg = (viewBox, body, size = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}" aria-hidden="true" focusable="false">${body}</svg>`;

export const ICONS = Object.freeze({
  phone: (s) => svg('0 0 24 24', '<path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1c0 1.22.2 2.42.57 3.56a1 1 0 0 1-.24 1.02l-2.2 2.21z"/>', s),
  arrow: (s = 16) => svg('0 0 16 16', '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/>', s),
  mail: (s) => svg('0 0 24 24', '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3.5 5.5h17v13h-17z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="m4 6 8 6.5L20 6"/>', s),
  pin: (s) => svg('0 0 24 24', '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/>', s),
  roof: (s = 18) => svg('0 0 24 16', '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="miter" d="M2 15V9.5L12 2l10 7.5V15"/>', s),
  check: (s = 18) => svg('0 0 20 20', '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m4.5 10.5 3.5 3.5 7.5-8"/>', s),
  dash: (s = 18) => svg('0 0 20 20', '<path stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M6 10h8"/>', s),
  whatsapp: (s = 28) => svg('0 0 32 32', '<path fill="currentColor" d="M16 .396C7.2.396.005 7.59.005 16.396c0 2.887.758 5.704 2.204 8.188L.11 31.927l7.558-2.047a15.82 15.82 0 0 0 8.332 2.316h.006c8.8 0 15.994-7.193 15.994-16 0-4.266-1.66-8.272-4.672-11.283C24.272 2.056 20.266.396 16 .396Zm0 29.084c-2.652 0-5.238-.713-7.488-2.063l-.537-.318-4.488 1.214 1.195-4.367-.35-.551a13.32 13.32 0 0 1-2.037-7.104c0-7.34 5.973-13.313 13.313-13.313 3.555 0 6.89 1.387 9.404 3.9 2.514 2.52 3.896 5.854 3.896 9.409 0 7.34-5.973 13.313-13.313 13.313Zm7.285-9.947c-.398-.2-2.355-1.16-2.72-1.293-.365-.136-.632-.2-.9.2-.265.398-1.032 1.293-1.265 1.558-.232.265-.465.298-.863.099-.398-.2-1.68-.62-3.197-1.976-1.18-1.05-1.977-2.352-2.21-2.75-.232-.398-.025-.613.175-.813.18-.18.398-.465.598-.698.2-.232.265-.398.398-.664.132-.265.066-.498-.033-.698-.1-.2-.9-2.166-1.233-2.966-.324-.78-.654-.673-.9-.685-.232-.012-.498-.015-.765-.015-.265 0-.698.1-1.065.498-.365.398-1.398 1.367-1.398 3.332s1.432 3.863 1.632 4.132c.2.265 2.816 4.297 6.82 6.028.954.412 1.7.66 2.28.844.957.305 1.828.262 2.516.159.768-.114 2.355-.961 2.688-1.889.332-.928.332-1.722.232-1.889-.1-.166-.365-.265-.764-.465Z"/>', s),
  star: (s = 14) => svg('0 0 20 20', '<path fill="currentColor" d="m10 1.8 2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/>', s),
});

/** Textlink mit Pfeil (Pfeil rückt beim Hover nach rechts). */
export const arrowLink = (href, label, extra = '') =>
  `<a class="link-arrow" href="${href}"${extra}><span>${label}</span>${ICONS.arrow()}</a>`;

/** Primär-Button. variant: 'ink' (Standard) oder 'accent' (auf dunklem Grund). */
export const button = (href, label, { variant = 'ink', magnetic = true, extra = '' } = {}) =>
  `<a class="btn btn--${variant}" href="${href}"${magnetic ? ' data-magnetic' : ''}${extra}><span class="btn__label">${label}</span><span class="btn__icon">${ICONS.arrow()}</span></a>`;

export const overline = (text) => `<p class="overline">${text}</p>`;

export const phoneLink = (site, className = 'phone-link') =>
  `<a class="${className}" href="tel:${site.phoneE164}">${ICONS.phone(18)}<span>${site.phoneDisplay}</span></a>`;

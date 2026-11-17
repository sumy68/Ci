/* Navigation: Scroll-Zustand, Ein-/Ausblenden, Mobil-Overlay, aktiver Abschnitt */
(function () {
  'use strict';

  var header = document.querySelector('[data-header]');
  var burger = document.querySelector('[data-burger]');
  var menu = document.getElementById('site-menu');
  if (!header || !burger || !menu) return;

  var root = document.documentElement;
  var LABEL_OPEN = 'Menü öffnen';
  var LABEL_CLOSE = 'Menü schließen';
  var HIDE_AFTER = 120; // px – darunter bleibt der Header immer sichtbar
  var DELTA = 6;        // px – Mindestbewegung gegen Flackern

  /* ---------- Mobil-Menü ---------- */
  var isOpen = function () {
    return burger.getAttribute('aria-expanded') === 'true';
  };

  var setMenu = function (open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? LABEL_CLOSE : LABEL_OPEN);
    header.classList.toggle('is-menu-open', open);
    root.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    // Smooth-Scroll (Lenis) pausieren, solange das Overlay offen ist
    document.dispatchEvent(new CustomEvent('ci:menu', { detail: { open: open } }));
    if (open) {
      header.classList.remove('is-hidden');
      var first = menu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }
  };

  burger.addEventListener('click', function () {
    setMenu(!isOpen());
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a') && isOpen()) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      setMenu(false);
      burger.focus();
      return;
    }
    // Fokus im geöffneten Overlay halten (Menü-Links + Burger)
    if (e.key === 'Tab') {
      var phoneIcon = header.querySelector('.nav-phone-icon');
      var focusables = Array.prototype.slice.call(menu.querySelectorAll('a, button'))
        .concat(phoneIcon ? [phoneIcon, burger] : [burger]);
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Beim Wechsel auf Desktop-Breite Menü-Zustand zurücksetzen
  var desktop = window.matchMedia('(min-width: 1025px)');
  var onBreakpoint = function (mq) {
    if (mq.matches && isOpen()) setMenu(false);
  };
  if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);

  /* ---------- Transparent -> weiß/blur ab dem ersten Scrollen ---------- */
  // Sentinel statt Scroll-Listener: funktioniert unabhängig vom Scroll-Container
  var sentinel = document.querySelector('[data-nav-sentinel]');
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  } else {
    header.classList.add('is-scrolled');
  }

  /* ---------- Beim Runterscrollen ausblenden, beim Hochscrollen zeigen ---------- */
  var lastY = window.scrollY;
  var ticking = false;
  var update = function () {
    ticking = false;
    var y = window.scrollY;
    if (Math.abs(y - lastY) < DELTA) return;
    var hide = y > lastY && y > HIDE_AFTER && !isOpen() && !header.contains(document.activeElement);
    header.classList.toggle('is-hidden', hide);
    lastY = y;
  };
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  header.addEventListener('focusin', function () {
    header.classList.remove('is-hidden');
  });

  /* ---------- Aktiver Abschnitt ---------- */
  var links = Array.prototype.slice.call(menu.querySelectorAll('.nav-link[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  // Abschnitte ohne eigenen Menüpunkt einem Menüpunkt zuordnen
  var ALIASES = { 'vorher-nachher': 'leistungen' };

  var setActive = function (id) {
    var target = ALIASES[id] || id;
    links.forEach(function (link) {
      var match = link.getAttribute('href') === '#' + target;
      link.classList.toggle('is-active', match);
      if (match) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  var sections = document.querySelectorAll('section[id]');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  Array.prototype.forEach.call(sections, function (s) { spy.observe(s); });
})();

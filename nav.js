/* Navigation: Scroll-Zustand, Mobil-Overlay, aktiver Abschnitt */
(function () {
  'use strict';

  var header = document.querySelector('[data-header]');
  var burger = document.querySelector('[data-burger]');
  var menu = document.getElementById('site-menu');
  if (!header || !burger || !menu) return;

  var root = document.documentElement;
  var LABEL_OPEN = 'Menü öffnen';
  var LABEL_CLOSE = 'Menü schließen';

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
    if (open) {
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
    if (e.key === 'Escape' && isOpen()) {
      setMenu(false);
      burger.focus();
    }
  });

  // Beim Wechsel auf Desktop-Breite Menü-Zustand zurücksetzen
  var desktop = window.matchMedia('(min-width: 1025px)');
  var onBreakpoint = function (mq) {
    if (mq.matches && isOpen()) setMenu(false);
  };
  if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);

  /* ---------- Transparent -> dunkel ab ~50px Scroll ---------- */
  // Sentinel statt Scroll-Listener: funktioniert unabhängig vom Scroll-Container
  var sentinel = document.querySelector('[data-nav-sentinel]');
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(sentinel);
  } else {
    header.classList.add('is-scrolled');
  }

  /* ---------- Aktiver Abschnitt ---------- */
  var links = Array.prototype.slice.call(menu.querySelectorAll('.nav-link[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  // Abschnitte ohne eigenen Menüpunkt einem Menüpunkt zuordnen
  var ALIASES = { standort: 'ueber-uns' };

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

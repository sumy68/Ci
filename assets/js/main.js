/* Interaktionen ohne externe Bibliotheken:
   Vorher/Nachher-Slider, WhatsApp-Button, Formular, Leistungs-Vorauswahl, Seitenwechsel */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  /* ---------- Vorher/Nachher-Slider (Maus, Touch, Tastatur) ---------- */
  function initCompare(stage) {
    var handle = stage.querySelector('[data-compare-handle]');
    if (!handle) return;
    var rect = null;
    var pos = 50;

    var set = function (value) {
      pos = clamp(Math.round(value * 10) / 10, 0, 100);
      stage.style.setProperty('--pos', pos + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
      // Wert = Anteil des „Vorher“-Bildes (links); Text beschreibt dieselbe Größe
      handle.setAttribute('aria-valuetext', Math.round(pos) + ' Prozent Vorher sichtbar');
    };
    var fromPointer = function (e) {
      set(((e.clientX - rect.left) / rect.width) * 100);
    };

    stage.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      rect = stage.getBoundingClientRect(); // einmal pro Geste messen
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('is-dragging');
      fromPointer(e);
    });
    stage.addEventListener('pointermove', function (e) {
      if (rect) fromPointer(e);
    });
    var end = function () {
      rect = null;
      stage.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);

    handle.addEventListener('keydown', function (e) {
      var steps = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -10, PageUp: 10 };
      if (e.key in steps) set(pos + steps[e.key]);
      else if (e.key === 'Home') set(0);
      else if (e.key === 'End') set(100);
      else return;
      e.preventDefault();
    });
    set(50);
  }

  function initCompareTabs() {
    var tabs = $$('[data-compare-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          var active = t === tab;
          t.setAttribute('aria-pressed', active ? 'true' : 'false');
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (!panel) return;
          // Crossfade per CSS (.is-active); inaktive Paare sind nicht bedienbar/vorlesbar
          panel.classList.toggle('is-active', active);
          if (active) {
            panel.removeAttribute('aria-hidden');
            panel.removeAttribute('inert');
          } else {
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('inert', '');
          }
        });
      });
    });
  }

  /* ---------- WhatsApp-Button: erst nach 300px, nie über dem Footer ---------- */
  function initFab() {
    var fab = document.querySelector('[data-wa-fab]');
    if (!fab) return;
    var footerVisible = false;
    var footer = document.querySelector('[data-footer]');
    var hint = document.querySelector('[data-scroll-hint]');
    var update = function () {
      var y = window.scrollY;
      fab.classList.toggle('is-visible', y > 300 && !footerVisible);
      if (hint && y > 10) hint.classList.add('is-gone');
    };
    if (footer && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        footerVisible = entries[0].isIntersecting;
        update();
      }).observe(footer);
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    update();
  }

  /* ---------- „Anfragen“-Links: Leistung im Formular vorauswählen ---------- */
  function initServiceLinks() {
    var select = document.getElementById('service');
    if (!select) return;
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-service]');
      if (!link) return;
      var value = link.getAttribute('data-service');
      var match = Array.prototype.some.call(select.options, function (o) { return o.value === value; });
      if (match) select.value = value;
    });
  }

  /* ---------- Kontaktformular (Formspree, Validierung, Statusmeldung) ---------- */
  var MESSAGES = {
    valueMissing: 'Bitte füllen Sie dieses Feld aus.',
    typeMismatch: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    patternMismatch: 'Bitte geben Sie eine gültige Telefonnummer ein.',
    sent: 'Danke! Ihre Anfrage ist bei uns angekommen. Wir melden uns zeitnah zurück.',
    failed: 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: 0155 6858 1734.'
  };

  function fieldError(input) {
    var v = input.validity;
    if (v.valid) return '';
    if (v.valueMissing) return MESSAGES.valueMissing;
    if (v.typeMismatch) return MESSAGES.typeMismatch;
    if (v.patternMismatch) return MESSAGES.patternMismatch;
    return MESSAGES.valueMissing;
  }

  function showError(form, input) {
    var msg = fieldError(input);
    var slot = form.querySelector('[data-error-for="' + input.name + '"]');
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (slot) slot.textContent = msg;
    return !msg;
  }

  function initForm() {
    var form = document.querySelector('[data-form]');
    if (!form || !window.fetch) return;
    var status = form.querySelector('[data-form-status]');
    var inputs = $$('input[name]:not([type="hidden"]):not([name="_gotcha"]), textarea', form);

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) showError(form, input); });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') showError(form, input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-sending')) return; // Doppelversand verhindern
      var invalid = inputs.filter(function (input) { return !showError(form, input); });
      if (invalid.length) {
        invalid[0].focus();
        return;
      }
      form.classList.add('is-sending');
      form.setAttribute('aria-busy', 'true');
      status.className = 'form__status';
      status.textContent = 'Wird gesendet …';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          status.classList.add('is-success');
          status.textContent = MESSAGES.sent;
        })
        .catch(function (err) {
          console.error('[Kontaktformular] Senden fehlgeschlagen:', err);
          status.classList.add('is-error');
          status.textContent = MESSAGES.failed;
        })
        .then(function () {
          form.classList.remove('is-sending');
          form.removeAttribute('aria-busy');
        });
    });
  }

  /* ---------- Kurzer Fade beim Wechsel zu Unterseiten ---------- */
  function initPageFade() {
    if (reduceMotion) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname) return; // Anker auf derselben Seite
      if (!/(\/|\/[^./]+|\.html)$/.test(url.pathname)) return; // nur HTML-Seiten, keine Downloads
      e.preventDefault();
      try { sessionStorage.setItem('ci-fade', '1'); } catch (err) { /* privater Modus */ }
      root.classList.add('is-leaving');
      window.setTimeout(function () { location.href = url.href; }, 220);
      // Sicherheitsnetz, falls die Navigation nicht stattfindet
      window.setTimeout(function () { root.classList.remove('is-leaving'); }, 3000);
    });
    window.addEventListener('pageshow', function () { root.classList.remove('is-leaving'); });
  }

  /* ---------- Endlos-Animationen (Laufband, Orbit) nur im Viewport laufen lassen ---------- */
  function initMarquee() {
    var targets = $$('.marquee, [data-autoplay]');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-running'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-running', entry.isIntersecting);
      });
    });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Leistungsverzeichnis: Vorschaubild folgt dem Mauszeiger (nur Desktop) ---------- */
  function initIndexPreview() {
    var box = document.querySelector('[data-index-preview]');
    if (!box || reduceMotion) return;
    var mq = window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)');
    var img = box.querySelector('img');
    var BOX_W = 240;
    var GAP = 24;
    var state = { x: 0, y: 0, cx: 0, cy: 0, active: false, raf: 0 };

    var loop = function () {
      state.cx += (state.x - state.cx) * 0.18;
      state.cy += (state.y - state.cy) * 0.18;
      // Rechts vom Zeiger, am Bildschirmrand nach links ausweichen
      var ox = state.cx + GAP + BOX_W > window.innerWidth ? -(BOX_W + GAP) : GAP;
      box.style.transform = 'translate3d(' + (state.cx + ox) + 'px,' + (state.cy - 80) + 'px,0)';
      var moving = Math.abs(state.x - state.cx) > 0.3 || Math.abs(state.y - state.cy) > 0.3;
      state.raf = state.active || moving ? window.requestAnimationFrame(loop) : 0;
    };
    var show = function (src) {
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      box.classList.add('is-visible');
      state.active = true;
      if (!state.raf) state.raf = window.requestAnimationFrame(loop);
    };
    var hide = function () {
      box.classList.remove('is-visible');
      state.active = false;
    };

    $$('[data-preview-group]').forEach(function (row) {
      var first = row.querySelector('[data-preview]');
      row.addEventListener('pointerenter', function (e) {
        if (!mq.matches) return;
        state.x = state.cx = e.clientX;
        state.y = state.cy = e.clientY;
        row.classList.add('is-hover');
        show(first && first.getAttribute('data-preview'));
      });
      row.addEventListener('pointermove', function (e) {
        if (!mq.matches) return;
        state.x = e.clientX;
        state.y = e.clientY;
        var item = e.target.closest('[data-preview]');
        if (item) show(item.getAttribute('data-preview'));
      });
      row.addEventListener('pointerleave', function () {
        row.classList.remove('is-hover');
        hide();
      });
    });
    window.addEventListener('scroll', function () { if (state.active) hide(); }, { passive: true });
  }

  $$('[data-compare-stage]').forEach(initCompare);
  initIndexPreview();
  initMarquee();
  initCompareTabs();
  initFab();
  initServiceLinks();
  initForm();
  initPageFade();
})();

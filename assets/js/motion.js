/* Premium-Motion: Lenis Smooth Scroll + GSAP/ScrollTrigger/SplitText.
   Nur transform, opacity und clip-path werden animiert. Layout wird nur beim
   Initialisieren bzw. bei ScrollTrigger-Refresh gemessen, nie pro Frame.
   Bei prefers-reduced-motion oder fehlenden Bibliotheken passiert nichts –
   alle Inhalte sind dann ohne Animation sichtbar. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;
  var Lenis = window.Lenis;

  if (reduce || !gsap || !ScrollTrigger) {
    if (!reduce) console.error('[Motion] GSAP/ScrollTrigger nicht geladen – Animationen deaktiviert.');
    root.classList.add('motion-off');
    return;
  }
  // Boot-Fallback (2,5 s) bereits ausgelöst? Dann keine Hero-Animation mehr starten.
  var heroAllowed = !root.classList.contains('motion-off');
  root.classList.add('motion-on');
  root.classList.remove('motion-off');

  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);

  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var DESKTOP = '(min-width: 1025px) and (hover: hover) and (pointer: fine)';

  /* ---------- Smooth Scroll ---------- */
  function initLenis() {
    if (!Lenis) return null;
    var headerH = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 76;
    var lenis = new Lenis({ lerp: 0.1, anchors: { offset: -(headerH + 16) }, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('ci:menu', function (e) {
      if (e.detail && e.detail.open) lenis.stop();
      else lenis.start();
    });
    return lenis;
  }

  /* ---------- Signature: Abzieher wischt die Scheibe sauber ---------- */
  function wipeTimeline(wipe, tool, dirty, glint) {
    var OFFSET = 6; // Abzieher startet knapp außerhalb des Bildes
    var width = function () { return wipe.offsetWidth + OFFSET; };
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    tl.to(dirty, { clipPath: 'inset(0% 100% 0% 0%)', duration: 1 }, 0)
      .to(tool, { x: function () { return -width(); }, duration: 1 }, 0)
      // leicht gebogene Bahn: minimale Auf-und-ab-Bewegung + Rotation ±3°
      .to(tool, { keyframes: { y: [0, -8, -10, 6, 0], rotation: [0, -3, 1, 3, 0] }, duration: 1 }, 0)
      .to(tool, { x: function () { return -(width() + tool.offsetWidth * 1.15); }, duration: 0.22, ease: 'power1.in' }, 1)
      .fromTo(glint, { xPercent: -120, opacity: 0 }, { xPercent: 330, opacity: 1, duration: 0.38, ease: 'power2.inOut' }, 1.02)
      .to(glint, { opacity: 0, duration: 0.12 }, 1.3);
    return tl;
  }

  function initWipe(mm) {
    var wipe = document.querySelector('[data-wipe]');
    if (!wipe) return;
    var tool = wipe.querySelector('[data-wipe-tool]');
    var dirty = wipe.querySelector('[data-wipe-dirty]');
    var glint = wipe.querySelector('[data-wipe-glint]');
    if (!heroAllowed || !tool || !dirty) {
      wipe.classList.add('is-clean');
      return;
    }
    var hero = wipe.closest('.hero');

    // Desktop: Hero kurz pinnen, sobald das Panorama vollständig sichtbar ist,
    // dann Wisch synchron zum Scrollen. Start wird nur beim Refresh gemessen.
    var pinStart = function () {
      var bottom = wipe.getBoundingClientRect().bottom + window.scrollY;
      return Math.max(0, Math.round(bottom - (window.innerHeight - 24)));
    };
    mm.add(DESKTOP, function () {
      var tl = wipeTimeline(wipe, tool, dirty, glint);
      ScrollTrigger.create({
        trigger: hero,
        start: pinStart,
        end: '+=80%',
        pin: true,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true
      });
      return function () { tl.kill(); gsap.set([tool, dirty, glint].filter(Boolean), { clearProps: 'all' }); };
    });

    // Mobil, Tablet, Touch: einmal automatisch nach dem Laden
    mm.add('(max-width: 1024px), (hover: none), (pointer: coarse)', function () {
      var tl = wipeTimeline(wipe, tool, dirty, glint);
      var play = gsap.to(tl, {
        progress: 1,
        duration: 2,
        delay: 0.4,
        ease: 'power2.inOut',
        onComplete: function () { wipe.classList.add('is-clean'); }
      });
      return function () {
        play.kill();
        tl.kill();
        // Zustand zurücksetzen, damit der Desktop-Wisch nach einem Resize wieder greift
        wipe.classList.remove('is-clean');
        gsap.set([tool, dirty, glint].filter(Boolean), { clearProps: 'all' });
      };
    });
  }

  /* ---------- Überschriften: Zeilen gleiten aus einer Maske ---------- */
  /*
   * Überschriften erst zerlegen, wenn sie sich dem Viewport nähern (eine
   * Bildschirmhöhe vorher) – statt alle beim Start. Das hält jede Aufgabe kurz.
   */
  function initHeadlines() {
    if (!SplitText) return;
    var heads = $$('[data-reveal="lines"]');
    if (!('IntersectionObserver' in window)) {
      heads.forEach(splitHeadline);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        safely(splitHeadline, entry.target);
      });
    }, { rootMargin: '0px 0px 100% 0px' });
    heads.forEach(function (el) { io.observe(el); });
  }

  function splitHeadline(el) {
    // autoSplit: bei Resize/Drehung neu teilen, damit Zeilenumbrüche stimmen
    SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'reveal-line',
        autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.lines, {
            yPercent: 100,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
        }
      });
  }

  /* ---------- Karten & Listen: sanft versetzt einblenden ---------- */
  function initStagger() {
    $$('[data-reveal="stagger"]').forEach(function (group) {
      var items = Array.prototype.slice.call(group.children);
      gsap.set(items, { y: 24, opacity: 0 });
      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08, clearProps: 'transform' });
        }
      });
    });
  }

  /* ---------- Bilder: clip-path-Reveal + Parallax (nur Desktop) ---------- */
  function initImages(mm) {
    $$('[data-reveal="image"]').forEach(function (frame) {
      var img = frame.querySelector('img');
      gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
        .fromTo(frame, { clipPath: 'inset(100% 0% 0% 0% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.2, ease: 'power4.inOut' })
        .fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
    });
    mm.add(DESKTOP, function () {
      $$('[data-parallax]').forEach(function (frame) {
        var img = frame.querySelector('img');
        frame.classList.add('has-parallax');
        gsap.fromTo(img, { y: -40 }, {
          y: 40,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      return function () { $$('[data-parallax]').forEach(function (f) { f.classList.remove('has-parallax'); }); };
    });
  }

  /* ---------- Karte: Radien zeichnen sich ---------- */
  function initMap() {
    $$('[data-reveal="map"]').forEach(function (map) {
      var circles = map.querySelectorAll('.map__radius.is-on');
      gsap.fromTo(circles, { strokeDasharray: 1, strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'power2.inOut',
        stagger: 0.18,
        scrollTrigger: { trigger: map, start: 'top 80%', once: true }
      });
    });
  }

  /* ---------- Kennzahlen zählen einmalig hoch ---------- */
  function initCounters() {
    $$('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var state = { v: 0 };
      el.textContent = '0';
      gsap.to(state, {
        v: target,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: function () { el.textContent = String(Math.round(state.v)); }
      });
    });
  }

  /* ---------- „So arbeiten wir“: links fix, rechts wechseln die Schritte ---------- */
  function initSteps(mm) {
    var section = document.querySelector('[data-process]');
    if (!section) return;
    var steps = $$('.step', section);
    var current = section.querySelector('[data-step-current]');
    var bar = section.querySelector('[data-step-bar]');
    var activate = function (i) {
      steps.forEach(function (s, j) { s.classList.toggle('is-active', i === j); });
      if (current) current.textContent = String(i + 1).padStart(2, '0');
      if (bar) bar.style.transform = 'scaleX(' + (i + 1) / steps.length + ')';
    };
    mm.add('(min-width: 1025px)', function () {
      activate(0);
      steps.forEach(function (step, i) {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: function (self) { if (self.isActive) activate(i); }
        });
      });
    });
  }

  /* ---------- Magnetische Primär-Buttons (max. 8 px) ---------- */
  function initMagnetic(mm) {
    mm.add(DESKTOP, function () {
      var cleanups = $$('[data-magnetic]').map(function (btn) {
        var xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        var yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        var rect = null;
        var enter = function () { rect = btn.getBoundingClientRect(); };
        var move = function (e) {
          if (!rect) return;
          var dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          var dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          xTo(Math.max(-1, Math.min(1, dx)) * 8);
          yTo(Math.max(-1, Math.min(1, dy)) * 8);
        };
        var leave = function () { rect = null; xTo(0); yTo(0); };
        btn.addEventListener('pointerenter', enter);
        btn.addEventListener('pointermove', move);
        btn.addEventListener('pointerleave', leave);
        return function () {
          btn.removeEventListener('pointerenter', enter);
          btn.removeEventListener('pointermove', move);
          btn.removeEventListener('pointerleave', leave);
          gsap.set(btn, { clearProps: 'transform' });
        };
      });
      return function () { cleanups.forEach(function (fn) { fn(); }); };
    });
  }

  /** Notfall: Animationen abbrechen und alle Inhalte sofort sichtbar machen. */
  function revealAll(err) {
    console.error('[Motion] Initialisierung fehlgeschlagen – Inhalte werden ohne Animation gezeigt:', err);
    ScrollTrigger.getAll().forEach(function (st) { st.kill(true); });
    gsap.set($$('[data-reveal="stagger"] > *, [data-reveal="image"], [data-reveal="image"] img'), { clearProps: 'all' });
    $$('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    var wipe = document.querySelector('[data-wipe]');
    if (wipe) wipe.classList.add('is-clean');
    root.classList.add('motion-off');
  }

  function safely(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    try {
      fn.apply(null, args);
      return true;
    } catch (err) {
      revealAll(err);
      return false;
    }
  }

  /**
   * Der gepinnte Hero fügt nach dem Laden Scroll-Abstand ein. Wurde die Seite
   * über einen Anker geöffnet (z. B. /#kontakt), springen wir danach erneut ans Ziel.
   */
  function restoreHashTarget() {
    if (!location.hash || location.hash.length < 2) return;
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    var headerH = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 76;
    var y = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }

  var lenis = null;

  /** Gibt den Hauptthread kurz frei, damit keine langen Aufgaben (TBT) entstehen. */
  var yieldToMain = function () {
    return new Promise(function (resolve) { window.setTimeout(resolve, 0); });
  };

  function init() {
    var mm = gsap.matchMedia();
    if (!safely(function () { lenis = initLenis(); })) return;
    // Wisch zuerst (oberhalb des Falzes), danach die übrigen Schritte je in eigener Aufgabe
    var steps = [
      [initWipe, mm], [initStagger], [initImages, mm], [initMap],
      [initCounters], [initSteps, mm], [initMagnetic, mm]
    ];
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    steps.reduce(function (chain, step) {
      return chain.then(function (ok) {
        if (!ok) return false;
        return yieldToMain().then(function () { return safely.apply(null, step); });
      });
    }, Promise.resolve(true))
      .then(function (ok) {
        if (!ok) return;
        // Zeilen erst nach dem Laden der Schriften teilen (korrekte Umbrüche)
        return fontsReady.then(yieldToMain).then(function () {
          if (safely(initHeadlines)) ScrollTrigger.refresh();
          restoreHashTarget();
        });
      });
  }

  // Erst nach dem ersten Rendern initialisieren
  window.requestAnimationFrame(function () { window.requestAnimationFrame(init); });
})();

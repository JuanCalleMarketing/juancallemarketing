/* ============================================================
   Juan Calle Marketing — loader, animaciones y scroll

   Dependencias globales externas (CDN, cargadas en index.html antes
   de este archivo):
   - gsap 3.12.5           → window.gsap
   - ScrollTrigger 3.12.5  → window.ScrollTrigger
   - window.JCMCargador    → controlador del loader (script en el <head>)

   Si GSAP no carga, este archivo cierra el loader, muestra el inicio y
   sale: la página queda completa y navegable, sin animaciones.

   Política de movimiento (la misma en toda la página):
   - Textos (titulares, párrafos, formulario): se revelan una vez y
     quedan visibles para leer tranquilo.
   - Piezas visuales (tarjetas, logos, pasos, iconos): se revelan al
     bajar y se recogen si vuelves a subir y quedan bajo la pantalla,
     así la escena se reproduce otra vez al volver a bajar.
   - Escenas ligadas al scroll (telones, líneas de luz, parallax, frase
     protagonista y proceso): siguen el progreso del scroll en los dos
     sentidos.
   - Dos escenas fijas en escritorio: la frase de Resultados y el
     Proceso de trabajo.
   - En celular y tablet ninguna escena fija la pantalla (el scroll táctil
     es más rápido y fijar se siente atrapado). Cada escena de escritorio
     tiene una versión ligada al scroll: la frase se ilumina sin fijarse,
     cada paso del proceso dibuja su trazo al llegar, los iconos del
     retrato hacen una mini órbita y las portadas se mueven en su marco.

   Todo se crea dentro de gsap.matchMedia(): al cambiar de tamaño de
   pantalla o de preferencia de movimiento, GSAP revierte la versión
   anterior antes de crear la nueva, sin duplicar triggers ni timelines.
   ============================================================ */

(function () {
  'use strict';

  var raiz = document.documentElement;
  var cargador = window.JCMCargador;

  function mostrarInicio() { raiz.classList.remove('anim-pendiente'); }
  function cerrarCargador() { if (cargador) cargador.cerrar(); }
  // Segundos que faltan para que el loader haya durado al menos "minimo" ms
  function faltaCargador(minimo) {
    if (!cargador) return 0;
    return Math.max(0, minimo - (Date.now() - cargador.inicio)) / 1000;
  }

  if (!window.gsap || !window.ScrollTrigger) {
    mostrarInicio();
    setTimeout(cerrarCargador, faltaCargador(700) * 1000);
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Si el respaldo del <head> ya mostró el inicio, la entrada no se repite
  var introPendiente = raiz.classList.contains('anim-pendiente');
  var introHecha = false;

  /* ---------- Utilidades ---------- */

  // Envuelve cada palabra en .palabra > span (para revelarla con máscara).
  // Conserva <strong> y deja el texto completo como nombre accesible.
  function dividirPalabras(nodo, conEtiqueta) {
    if (!nodo) return [];
    if (!nodo.hasAttribute('data-dividido')) {
      if (conEtiqueta) nodo.setAttribute('aria-label', nodo.textContent.replace(/\s+/g, ' ').trim());
      (function recorrer(padre) {
        [].slice.call(padre.childNodes).forEach(function (hijo) {
          if (hijo.nodeType === 1) { recorrer(hijo); return; }
          if (hijo.nodeType !== 3) return;
          var frag = document.createDocumentFragment();
          hijo.textContent.split(/(\s+)/).forEach(function (parte) {
            if (!parte) return;
            if (/^\s+$/.test(parte)) { frag.appendChild(document.createTextNode(parte)); return; }
            var envoltura = document.createElement('span');
            envoltura.className = 'palabra';
            if (conEtiqueta) envoltura.setAttribute('aria-hidden', 'true');
            var interior = document.createElement('span');
            interior.textContent = parte;
            envoltura.appendChild(interior);
            frag.appendChild(envoltura);
          });
          padre.replaceChild(frag, hijo);
        });
      })(nodo);
      nodo.setAttribute('data-dividido', '');
    }
    return gsap.utils.toArray(nodo.querySelectorAll('.palabra > span'));
  }

  // Recalcula posiciones cuando cambia la altura de algo (pestañas, filtros…)
  var temporizadorRefresco = null;
  function refrescar() {
    clearTimeout(temporizadorRefresco);
    temporizadorRefresco = setTimeout(function () { ScrollTrigger.refresh(); }, 150);
  }

  // Revelado escalonado al entrar en pantalla.
  // reversible: se recoge al volver a subir (piezas visuales);
  // si no, se reproduce una vez y queda visible (textos).
  function revelar(objetivos, desde, disparador, inicio, reversible) {
    var lista = gsap.utils.toArray(objetivos);
    if (!lista.length) return;
    var st = { trigger: disparador || lista[0], start: inicio || 'top 86%' };
    if (reversible) st.toggleActions = 'play none none reverse';
    else st.once = true;
    var opciones = { opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.08, scrollTrigger: st };
    if (!reversible) opciones.clearProps = 'transform,opacity';
    gsap.from(lista, Object.assign(opciones, desde || {}));
  }

  var mm = gsap.matchMedia();

  mm.add({
    animar: '(prefers-reduced-motion: no-preference)',
    grande: '(min-width: 1001px)'
  }, function (contexto) {
    var c = contexto.conditions;

    // Movimiento reducido: todo visible y estático; el loader sale por opacidad
    if (!c.animar) {
      mostrarInicio();
      setTimeout(cerrarCargador, faltaCargador(400) * 1000);
      return;
    }

    raiz.classList.add('con-movimiento');
    var limpiar = [];

    /* ---------- Loader → entrada del inicio (una sola vez por visita) ---------- */

    var salidaLoader = faltaCargador(900);
    gsap.delayedCall(salidaLoader, function () {
      cerrarCargador();
      gsap.delayedCall(1, refrescar);
    });

    if (introPendiente && !introHecha) {
      introHecha = true;
      var palabrasH1 = dividirPalabras(document.getElementById('hero-titulo'), true);
      var tarjetasHero = gsap.utils.toArray('.hero-videos .trabajo');
      // Empieza mientras el telón del loader sube
      gsap.timeline({ delay: salidaLoader + 0.3, defaults: { ease: 'expo.out', duration: 1.1 } })
        .from('.hero-rol', { y: 18, opacity: 0, duration: 0.8 })
        .from(palabrasH1, { yPercent: 115, stagger: 0.055 }, '-=0.5')
        .from('.hero-bajada, .hero-botones, .validacion', { y: 22, opacity: 0, stagger: 0.08, duration: 0.9, clearProps: 'transform,opacity' }, '-=0.8')
        // La foto junto al título se descubre de abajo hacia arriba
        .from('.hero-foto-marco', { opacity: 0, duration: 1, ease: 'power2.out', clearProps: 'opacity' }, 0.2)
        .from('.hero-foto', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.2)
        .from('.hero-foto img', { scale: 1.3, duration: 1.8, clearProps: 'scale' }, 0.2)
        .from(tarjetasHero, {
          y: 90,
          opacity: 0,
          rotation: function (i) { return [-5, 0, 5][i] || 0; },
          stagger: 0.1,
          duration: 1.4,
          // Solo opacidad: el transform lo comparte con la profundidad al hacer scroll
          clearProps: 'opacity'
        }, 0.3)
        .from('.hero-pie, .hero-scroll', { opacity: 0, duration: 0.8, clearProps: 'opacity' }, '-=0.7');
    }
    mostrarInicio();

    /* ---------- Barra de progreso global ---------- */

    gsap.to('#progreso-barra', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });

    /* ---------- Salida del inicio: profundidad contenida ---------- */

    if (c.grande) {
      var salidaHero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero-videos', { yPercent: -10, ease: 'none', scrollTrigger: salidaHero });      gsap.to('.hero-texto', { yPercent: 8, opacity: 0.35, ease: 'none', scrollTrigger: salidaHero });
      gsap.to('.hero-halo', { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: salidaHero });
      // La portada se desplaza dentro de su marco (efecto ventana)
      gsap.fromTo('.hero-videos .trabajo-portada', { scale: 1.08, yPercent: 0 }, { scale: 1.08, yPercent: 5, ease: 'none', scrollTrigger: salidaHero });
    } else {
      // Celular: las tarjetas quedan bajo el texto, así que la escena va
      // ligada a su paso por la pantalla, con recorridos cortos
      var pasoTarjetas = { trigger: '.hero-lado', start: 'top bottom', end: 'bottom top', scrub: true };
      gsap.fromTo('.hero-videos .trabajo-portada', { scale: 1.1, yPercent: -4 }, { scale: 1.1, yPercent: 4, ease: 'none', scrollTrigger: pasoTarjetas });
      gsap.to('.hero-halo', { yPercent: 30, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Profundidad escalonada: cada tarjeta del inicio se mueve a su propia velocidad
    var profundidad = c.grande ? [10, -6, 14] : [8, -5, 10];
    gsap.utils.toArray('.hero-videos .trabajo').forEach(function (t, i) {
      gsap.fromTo(t, { yPercent: profundidad[i] || 0 }, {
        yPercent: -(profundidad[i] || 0),
        ease: 'none',
        scrollTrigger: { trigger: '.hero-lado', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* ---------- Telón: las secciones oscuras se expanden al entrar ---------- */

    gsap.utils.toArray('.telon').forEach(function (telon) {
      gsap.fromTo(telon,
        { scaleX: c.grande ? 0.94 : 0.97, borderRadius: '40px 40px 0 0' },
        {
          scaleX: 1,
          borderRadius: '0px 0px 0px 0px',
          ease: 'none',
          scrollTrigger: { trigger: telon.parentNode, start: 'top bottom', end: 'top 20%', scrub: true }
        });
    });

    /* ---------- Títulos: palabras que suben tras una máscara ---------- */

    gsap.utils.toArray('[data-titulo]').forEach(function (titulo) {
      gsap.from(dividirPalabras(titulo, true), {
        yPercent: 115,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.05,
        scrollTrigger: { trigger: titulo, start: 'top 88%', once: true }
      });
    });

    gsap.utils.toArray('.ceja, .encabezado--fila > p').forEach(function (n) {
      revelar(n, { y: 16, duration: 0.9 }, n, 'top 90%');
    });

    // Línea de luz bajo cada encabezado, dibujada por el scroll
    gsap.utils.toArray('.encabezado--fila').forEach(function (enc) {
      gsap.fromTo(enc, { '--trazo': 0 }, {
        '--trazo': 1,
        ease: 'none',
        scrollTrigger: { trigger: enc, start: 'top 85%', end: 'bottom 55%', scrub: 0.6 }
      });
    });

    /* ---------- Portafolio ---------- */

    revelar('.filtros .filtro', { y: 16, stagger: 0.04, duration: 0.7 }, '.filtros');

    // Tarjetas: entrada por lotes (reversible) y portada con parallax interior
    var piezasGaleria = [];
    function montarGaleria(rapido) {
      piezasGaleria.forEach(function (p) { p.kill(); });
      piezasGaleria = [];
      contexto.add(function () {
        var tarjetas = gsap.utils.toArray('.galeria .trabajo');
        gsap.set(tarjetas, { opacity: 0, y: rapido ? 28 : 60 });
        piezasGaleria = ScrollTrigger.batch(tarjetas, {
          start: 'top 94%',
          onEnter: function (lote) {
            gsap.to(lote, { opacity: 1, y: 0, duration: rapido ? 0.6 : 1, ease: 'power3.out', stagger: rapido ? 0.04 : 0.08, overwrite: true });
          },
          onLeaveBack: function (lote) {
            gsap.to(lote, { opacity: 0, y: 60, duration: 0.4, ease: 'power2.in', overwrite: true });
          }
        });
        // Portada que se desplaza dentro de su marco (en celular, con menos recorrido)
        var recorrido = c.grande ? 4 : 3;
        tarjetas.forEach(function (t) {
          var img = t.querySelector('.trabajo-portada');
          if (!img) return;
          piezasGaleria.push(gsap.fromTo(img, { scale: 1.1, yPercent: -recorrido }, {
            scale: 1.1,
            yPercent: recorrido,
            ease: 'none',
            scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true }
          }));
        });
      });
    }
    montarGaleria(false);

    function alFiltrar() { montarGaleria(true); refrescar(); }
    document.addEventListener('galeria:pintada', alFiltrar);
    document.addEventListener('pagina:medidas', refrescar);
    limpiar.push(function () {
      document.removeEventListener('galeria:pintada', alFiltrar);
      document.removeEventListener('pagina:medidas', refrescar);
      piezasGaleria.forEach(function (p) { p.kill(); });
    });

    /* ---------- Quién soy: retrato, órbita de redes y pasos ---------- */

    var retrato = document.getElementById('retrato');
    if (retrato) {
      var foto = retrato.querySelector('.retrato-foto');
      gsap.from(foto, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.5,
        ease: 'expo.out',
        clearProps: 'clipPath',
        scrollTrigger: { trigger: retrato, start: 'top 80%', once: true }
      });
      gsap.fromTo(foto.querySelector('img'),
        { scale: 1.16, yPercent: -2 },
        { scale: 1.06, yPercent: 2, ease: 'none', scrollTrigger: { trigger: retrato, start: 'top bottom', end: 'bottom top', scrub: true } });
      revelar('.retrato-orbitas', { opacity: 0, y: 0, scale: 0.9, duration: 1.6, ease: 'expo.out' }, retrato, 'top 75%', true);

      if (c.grande) limpiar.push(orbitar(retrato));
      else {
        revelar('.red-icono', { y: 0, scale: 0.4, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.1 }, retrato, 'top 70%', true);
        orbitarConScroll(retrato);
      }
    }

    var pasos = document.getElementById('pasos');
    if (pasos) {
      gsap.fromTo(pasos, { '--avance': 0 }, {
        '--avance': 1,
        ease: 'none',
        scrollTrigger: { trigger: pasos, start: 'top 82%', end: c.grande ? 'top 45%' : 'bottom 60%', scrub: 0.6 }
      });
      revelar(pasos.children, { y: 24, stagger: 0.12 }, pasos, 'top 82%', true);
    }

    revelar('.certificaciones-texto', { y: 20 }, '.certificaciones');
    revelar('#logos-cert li', { y: 24, stagger: 0.07, duration: 0.8 }, '#logos-cert', 'top 92%', true);

    /* ---------- Mi sistema ---------- */

    revelar('.tabs .tab', { x: -24, y: 0, stagger: 0.07, duration: 0.8 }, '.sistema');
    revelar('.paneles', { y: 50, duration: 1.1 }, '.sistema');

    /* ---------- Resultados y frase protagonista (escena fija 1) ---------- */

    revelar('#resultados-lista .resultado', { y: 60, stagger: 0.1 }, '#resultados-lista', 'top 88%', true);

    var cita = document.getElementById('cita-grande');
    if (cita) {
      gsap.fromTo(dividirPalabras(cita, false), { opacity: 0.14 }, {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: c.grande
          ? { trigger: '#cita-escena', start: 'center center', end: '+=70%', scrub: 0.5, pin: true, anticipatePin: 1 }
          : { trigger: cita, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 }
      });
    }

    /* ---------- Opciones de inversión: breve, sin retrasar la lectura ---------- */

    revelar('.planes .plan', { y: 30, duration: 0.7, stagger: 0.08 }, '.planes', 'top 94%');

    /* ---------- Proceso (escena fija 2 en escritorio) ---------- */

    var pasosProceso = gsap.utils.toArray('#proceso-lista > li');
    if (c.grande && pasosProceso.length) {
      var escena = gsap.timeline({
        scrollTrigger: { trigger: '#proceso', start: 'top top', end: '+=90%', scrub: 0.6, pin: true, anticipatePin: 1 }
      });
      escena.fromTo('#proceso-luz', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 4 }, 0);
      pasosProceso.forEach(function (li, i) {
        escena.fromTo(li, { opacity: 0.35, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, i * 1.05);
        escena.fromTo(li.querySelector('.proceso-n'), { scale: 0.7 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' }, i * 1.05);
      });
    } else {
      // Celular y tablet: sin fijar la sección. Cada paso tiene su propia
      // escena: el trazo verde se dibuja y el paso se ilumina al llegar a él
      pasosProceso.forEach(function (li) {
        var paso = { trigger: li, start: 'top 90%', end: 'top 55%', scrub: 0.5 };
        gsap.fromTo(li, { '--trazo-paso': 0, opacity: 0.35, y: 24 }, { '--trazo-paso': 1, opacity: 1, y: 0, ease: 'none', scrollTrigger: paso });
        gsap.fromTo(li.querySelector('.proceso-n'), { scale: 0.6 }, { scale: 1, ease: 'back.out(2)', scrollTrigger: paso });
      });
    }

    /* ---------- Testimonios y contacto ---------- */

    revelar('.pila-zona', { x: c.grande ? 60 : 0, y: c.grande ? 0 : 40, duration: 1.2 }, '#testimonios', 'top 70%', true);
    revelar('.pila-controles, .pila-puntos', { y: 16, stagger: 0.08 }, '.pila-controles');
    revelar('#contacto .texto-grande, .datos > div', { y: 24, stagger: 0.08 }, '#contacto', 'top 70%');
    revelar('.formulario', { y: 50, duration: 1.1 }, '.formulario', 'top 90%');

    /* ---------- Pie: el logo se revela y la línea se dibuja al llegar al final ---------- */

    var finPagina = { trigger: '#pie', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 };
    gsap.fromTo('#pie-logo', { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.3 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, ease: 'none', scrollTrigger: finPagina });
    gsap.fromTo('#pie-luz', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: finPagina });

    /* ---------- Recalcular cuando cambia la geometría ---------- */

    window.addEventListener('load', refrescar);
    limpiar.push(function () { window.removeEventListener('load', refrescar); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refrescar);

    return function () {
      limpiar.forEach(function (fn) { fn(); });
      raiz.classList.remove('con-movimiento');
    };
  });

  /* ---------- Celular: mini órbita guiada por el scroll ----------
     Cada icono recorre un arco corto alrededor de su posición fija
     mientras el retrato cruza la pantalla; al subir vuelve por el mismo
     camino. La elipse es casi vertical (rx 2 %, ry 7 % del ancho) para
     que ningún icono se salga de la pantalla ni tape el rostro. */
  function orbitarConScroll(retrato) {
    var iconos = gsap.utils.toArray(retrato.querySelectorAll('.red-icono'));
    var arcos = [
      { inicio: 0.2, giro: 1.1, sentido: 1 },
      { inicio: 1.7, giro: 0.9, sentido: -1 },
      { inicio: 3.2, giro: 1.2, sentido: 1 },
      { inicio: 4.6, giro: 1, sentido: -1 }
    ];
    var setX = iconos.map(function (ic) { return gsap.quickSetter(ic, 'x', 'px'); });
    var setY = iconos.map(function (ic) { return gsap.quickSetter(ic, 'y', 'px'); });
    var estado = { p: 0 };
    function pintar() {
      var w = retrato.offsetWidth;
      var rx = w * 0.02;
      var ry = w * 0.07;
      iconos.forEach(function (ic, i) {
        var a = arcos[i % arcos.length];
        var angulo = a.inicio + a.sentido * a.giro * Math.PI * estado.p;
        // Desplazamiento relativo a la posición fija del CSS (en p = 0 no se mueve)
        setX[i](Math.cos(angulo) * rx - Math.cos(a.inicio) * rx);
        setY[i](Math.sin(angulo) * ry - Math.sin(a.inicio) * ry);
      });
    }
    gsap.to(estado, {
      p: 1,
      ease: 'none',
      onUpdate: pintar,
      scrollTrigger: { trigger: retrato, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });
  }

  /* ---------- Órbita de los iconos sociales alrededor del retrato ----------
     Sigue las dos elipses dibujadas en el SVG (.retrato-orbitas):
     exterior  cx 50%, cy 62.5%, rx 49%, ry 17.5% del escenario
     interior  cx 50%, cy 62.5%, rx 42%, ry 13% del escenario
     En la mitad trasera los iconos pasan detrás de la foto, siempre
     por debajo del rostro. Devuelve una función de limpieza. */
  function orbitar(retrato) {
    var iconos = gsap.utils.toArray(retrato.querySelectorAll('.red-icono'));
    // Tres iconos repartidos a un tercio de vuelta entre sí
    var pistas = [
      { rx: 0.49, ry: 0.175, inicio: 0.15, sentido: 1 },
      { rx: 0.42, ry: 0.13, inicio: 0.82, sentido: 1 },
      { rx: 0.49, ry: 0.175, inicio: 1.48, sentido: 1 }
    ];
    var medida = { w: 0, h: 0 };
    function medir() {
      medida.w = retrato.offsetWidth;
      medida.h = retrato.offsetHeight;
    }
    medir();
    retrato.classList.add('orbita-activa');

    var setX = iconos.map(function (ic) { return gsap.quickSetter(ic, 'x', 'px'); });
    var setY = iconos.map(function (ic) { return gsap.quickSetter(ic, 'y', 'px'); });
    var setS = iconos.map(function (ic) { return gsap.quickSetter(ic, 'scale'); });

    var estado = { t: 0 };
    function pintar() {
      var cy = medida.h * 0.125;
      iconos.forEach(function (ic, i) {
        var p = pistas[i % pistas.length];
        var a = (p.inicio + estado.t * p.sentido) * Math.PI;
        var seno = Math.sin(a);
        var frente = (seno + 1) / 2;
        setX[i](Math.cos(a) * medida.w * p.rx);
        setY[i](cy + seno * medida.h * p.ry);
        setS[i](0.78 + frente * 0.22);
        ic.style.opacity = (0.55 + frente * 0.45).toFixed(3);
        ic.style.zIndex = seno > -0.1 ? 3 : 1;
      });
    }

    var giro = gsap.to(estado, { t: 2, duration: 64, ease: 'none', repeat: -1, onUpdate: pintar });
    pintar();

    gsap.from(retrato.querySelector('.redes-orbita'), { autoAlpha: 0, duration: 1.4, ease: 'power2.out', clearProps: 'all', scrollTrigger: { trigger: retrato, start: 'top 75%', once: true } });

    // Solo gira mientras el retrato está en pantalla y nadie está por
    // hacer clic en un icono (mouse encima o foco con teclado)
    var enPantalla = false;
    var sobreIcono = false;
    function decidirGiro() { if (enPantalla && !sobreIcono) giro.play(); else giro.pause(); }
    ScrollTrigger.create({
      trigger: retrato,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: function (st) { enPantalla = st.isActive; decidirGiro(); }
    });
    var lista = retrato.querySelector('.redes-orbita');
    function detener() { sobreIcono = true; decidirGiro(); }
    function seguir() { sobreIcono = false; decidirGiro(); }
    lista.addEventListener('mouseover', detener);
    lista.addEventListener('mouseleave', seguir);
    lista.addEventListener('focusin', detener);
    lista.addEventListener('focusout', seguir);

    function alRefrescar() { medir(); pintar(); }
    ScrollTrigger.addEventListener('refresh', alRefrescar);

    return function () {
      ScrollTrigger.removeEventListener('refresh', alRefrescar);
      lista.removeEventListener('mouseover', detener);
      lista.removeEventListener('mouseleave', seguir);
      lista.removeEventListener('focusin', detener);
      lista.removeEventListener('focusout', seguir);
      giro.kill();
      retrato.classList.remove('orbita-activa');
      iconos.forEach(function (ic) {
        ic.style.opacity = '';
        ic.style.zIndex = '';
        gsap.set(ic, { clearProps: 'transform,visibility,opacity' });
      });
    };
  }
})();

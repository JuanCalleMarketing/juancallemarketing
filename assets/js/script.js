/* ============================================================
   Juan Calle Marketing — comportamiento de la página

   Este archivo no depende de ninguna librería externa: el portafolio,
   el visor, las pestañas, los testimonios, el menú y el formulario
   funcionan aunque GSAP no cargue. Las animaciones viven aparte,
   en assets/js/animaciones.js.

   Para agregar o cambiar videos y piezas, edita la lista
   "PORTAFOLIO" y "PRINCIPALES" de más abajo.
   Cada trabajo necesita su portada en la carpeta assets/images/portadas/
   (el nombre del archivo va en el campo "portada", sin el .jpg).
   Si falta la portada, la tarjeta muestra "Portada pendiente".
   ============================================================ */

(function () {
  'use strict';

  var WHATSAPP = '573053247075';
  var CARPETA_PORTADAS = 'assets/images/portadas/';
  var movimientoReducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Formas de enlazar cada red ---------- */

  // Instagram: reel o publicación. "codigo" es lo que va después de /reel/ o /p/
  function instagram(codigo, tipo) {
    var ruta = tipo === 'Publicación' ? 'p' : 'reel';
    var base = 'https://www.instagram.com/' + ruta + '/' + codigo + '/';
    return { red: 'instagram', tipo: tipo || 'Reel', enlace: base, embed: base + 'embed/' };
  }

  // TikTok: "corto" es el código del enlace vt.tiktok.com.
  // "id" es el número largo del video (tiktok.com/@usuario/video/NUMERO);
  // con él el reproductor carga directo. Si falta, se busca automáticamente.
  function tiktok(corto, id) {
    return { red: 'tiktok', tipo: 'Video', enlace: 'https://vt.tiktok.com/' + corto + '/', tiktokId: id || '' };
  }

  function trabajo(datos, red) {
    var t = { marca: datos.marca, grupo: datos.grupo || datos.marca, portada: CARPETA_PORTADAS + datos.portada + '.jpg', credito: datos.credito || '', principal: !!datos.principal };
    for (var k in red) t[k] = red[k];
    return t;
  }

  var CB = '© CB Studio';

  /* ---------- Los 3 videos principales (parte de arriba) ---------- */

  var PRINCIPALES = [
    trabajo({ marca: 'Magno Cosmetics', portada: 'magno-cosmetics', credito: CB, principal: true }, instagram('DdaJPPcTzN3')),
    trabajo({ marca: 'Celu Antioquia', portada: 'celu-antioquia', credito: 'Formato propio', principal: true }, tiktok('ZSgBmtGR2', '7693724847360249106')),
    trabajo({ marca: 'Before', portada: 'before', credito: CB, principal: true }, tiktok('ZSgBmTXgg', '7696303231932140818'))
  ];

  /* ---------- Portafolio ---------- */

  var PORTAFOLIO = [
    // Abogado Sergio
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-1' }, instagram('DdU76rrtBrV')),
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-2' }, instagram('DbWucQkta0x')),
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-3' }, instagram('DdnBfa2tDfe')),
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-4' }, instagram('DdC-FBINdj1')),
    // Videos que edité para CB Studio
    trabajo({ marca: 'Magno', portada: 'magno-1', credito: CB }, instagram('Ddm95IwzETk')),
    trabajo({ marca: 'Magno', portada: 'magno-2', credito: CB }, instagram('Dc2IkIHzUqO')),
    trabajo({ marca: 'Magno', portada: 'magno-3', credito: CB }, instagram('Dd49uUYzpnC')),
    trabajo({ marca: 'Íntimas', portada: 'intimas-1', credito: CB }, tiktok('ZSgBukAxB', '7696304216268147975')),
    trabajo({ marca: 'Íntimas', portada: 'intimas-2', credito: CB }, tiktok('ZSgBunEMS', '7694087416122002695')),
    trabajo({ marca: 'Íntimas', portada: 'intimas-3', credito: CB }, tiktok('ZSgBuvtaD', '7675512699345800468')),
    trabajo({ marca: 'Malawy', portada: 'malawy-1', credito: CB }, tiktok('ZSgBHR7tG', '7683677464693902612')),
    trabajo({ marca: 'Malawy', portada: 'malawy-2', credito: CB }, instagram('Dd49LauhWRi')),
    // ZenKon
    trabajo({ marca: 'ZenKon', portada: 'zenkon-1' }, instagram('DTTIaj0D8a8')),
    trabajo({ marca: 'ZenKon', portada: 'zenkon-2' }, instagram('Da0Txu7tvSH')),
    trabajo({ marca: 'ZenKon', portada: 'zenkon-3' }, instagram('Dbvo2rSupMo')),
    trabajo({ marca: 'Renuevo', portada: 'renuevo-1', credito: CB }, instagram('DdFoZbbNaXs')),
    // Marca personal (TikTok @juancalle___)
    trabajo({ marca: 'Marca personal', portada: 'marca-personal-1' }, tiktok('ZSgyCPSWg', '7677766552761978119')),
    trabajo({ marca: 'Marca personal', portada: 'marca-personal-2' }, tiktok('ZSgyCUjpU', '7676321883171720455'))
  ];

  /* ---------- Utilidades ---------- */

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  // Avisa a animaciones.js (si cargó) de que hay contenido nuevo
  function avisar(nombre, detalle) {
    var ev;
    try { ev = new CustomEvent(nombre, { detail: detalle }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent(nombre, false, false, detalle); }
    document.dispatchEvent(ev);
  }

  var ICONO_IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>';
  var ICONO_TT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3v11a4 4 0 1 1-4-4"/><path d="M15 3c.3 2.6 2.2 4.6 5 4.8"/></svg>';
  var ICONO_PLAY = '<span class="trabajo-play" aria-hidden="true"><svg viewBox="0 0 24 24"><polygon points="7 3 20 12 7 21 7 3"/></svg></span>';
  var ICONO_FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';

  function nombreRed(t) { return t.red === 'instagram' ? 'Instagram' : 'TikTok'; }

  // Pone "Reel 1", "Reel 2"... cuando una marca tiene varios trabajos
  function numerar(lista) {
    var totales = {};
    var vistos = {};
    lista.forEach(function (t) { totales[t.grupo] = (totales[t.grupo] || 0) + 1; });
    lista.forEach(function (t) {
      vistos[t.grupo] = (vistos[t.grupo] || 0) + 1;
      t.sub = t.tipo + (totales[t.grupo] > 1 ? ' ' + vistos[t.grupo] : '');
    });
  }
  numerar(PRINCIPALES);
  numerar(PORTAFOLIO);

  /* ---------- Tarjeta de video (inicio y portafolio) ---------- */

  function crearTarjeta(item, lista, inmediata) {
    var art = el('article', 'trabajo');
    art.setAttribute('data-red', item.red);

    // Respaldo honesto si la portada no existe todavía
    var ph = el('span', 'trabajo-ph');
    ph.setAttribute('aria-hidden', 'true');
    ph.appendChild(el('span', 'trabajo-ph-marca', item.marca));
    ph.appendChild(el('span', 'trabajo-ph-nota', 'Portada pendiente'));
    art.appendChild(ph);

    // Fondo desenfocado: solo se ve si la portada no es vertical 9:16
    var fondo = document.createElement('img');
    fondo.className = 'trabajo-fondo';
    fondo.alt = '';
    fondo.setAttribute('aria-hidden', 'true');
    fondo.loading = 'lazy';
    fondo.decoding = 'async';

    var img = document.createElement('img');
    img.className = 'trabajo-portada';
    img.alt = '';
    img.loading = inmediata ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.width = 720;
    img.height = 1280;
    img.addEventListener('load', function () {
      // Portadas cuadradas o 4:5 se muestran completas en vez de recortarlas
      if (img.naturalWidth / img.naturalHeight > 0.62) {
        fondo.src = item.portada;
        art.insertBefore(fondo, img);
        art.classList.add('trabajo--contener');
      }
    });
    img.addEventListener('error', function () {
      art.classList.add('sin-portada');
      img.remove();
    });
    img.src = item.portada;
    art.appendChild(img);

    art.appendChild(el('span', 'trabajo-sombra'));

    var red = el('span', 'trabajo-red');
    red.innerHTML = item.red === 'instagram' ? ICONO_IG : ICONO_TT;
    red.appendChild(document.createTextNode(nombreRed(item)));
    art.appendChild(red);

    var abrir = el('button', 'trabajo-abrir');
    abrir.type = 'button';
    abrir.setAttribute('aria-label', 'Reproducir ' + item.marca + ', ' + item.sub + ' de ' + nombreRed(item));
    abrir.innerHTML = ICONO_PLAY;
    abrir.addEventListener('click', function () {
      abrirVisor(lista, lista.indexOf(item));
    });
    art.appendChild(abrir);

    var info = el('div', 'trabajo-info');
    info.appendChild(el('p', 'trabajo-marca', item.marca));
    info.appendChild(el('p', 'trabajo-sub', item.sub));
    if (item.credito) info.appendChild(el('p', 'trabajo-credito', item.credito));
    var enlace = el('a', 'trabajo-enlace');
    enlace.href = item.enlace;
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    enlace.appendChild(document.createTextNode('Ver publicación'));
    enlace.insertAdjacentHTML('beforeend', ICONO_FLECHA);
    enlace.setAttribute('aria-label', 'Ver publicación original de ' + item.marca + ', ' + item.sub + ', en ' + nombreRed(item));
    info.appendChild(enlace);
    art.appendChild(info);

    return art;
  }

  /* ---------- Inicio: videos principales ---------- */

  var heroVideos = document.getElementById('hero-videos');
  if (heroVideos) {
    PRINCIPALES.forEach(function (t) { heroVideos.appendChild(crearTarjeta(t, PRINCIPALES, true)); });
  }

  /* ---------- Portafolio: filtros y galería ---------- */

  var galeria = document.getElementById('galeria');
  var filtros = document.getElementById('filtros');
  var conteo = document.getElementById('conteo');
  var grupoActivo = 'Todos';

  function gruposUnicos() {
    var g = [];
    PORTAFOLIO.forEach(function (t) { if (g.indexOf(t.grupo) === -1) g.push(t.grupo); });
    return g;
  }

  function contar(grupo) {
    return grupo === 'Todos' ? PORTAFOLIO.length : PORTAFOLIO.filter(function (t) { return t.grupo === grupo; }).length;
  }

  function pintarFiltros() {
    if (!filtros) return;
    filtros.textContent = '';
    ['Todos'].concat(gruposUnicos()).forEach(function (g) {
      var b = el('button', 'filtro', g);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(g === grupoActivo));
      b.appendChild(el('span', 'filtro-n', String(contar(g))));
      b.addEventListener('click', function () {
        if (g === grupoActivo) return;
        grupoActivo = g;
        [].forEach.call(filtros.children, function (otro) {
          otro.setAttribute('aria-pressed', String(otro === b));
        });
        cambiarGaleria();
      });
      filtros.appendChild(b);
    });
  }

  function listaActual() {
    return PORTAFOLIO.filter(function (t) { return grupoActivo === 'Todos' || t.grupo === grupoActivo; });
  }

  function pintarGaleria() {
    if (!galeria) return;
    galeria.textContent = '';
    var lista = listaActual();
    lista.forEach(function (t, i) {
      var tarjeta = crearTarjeta(t, lista, false);
      // Ritmo editorial: la primera pieza (y la décima en listas largas) va en grande
      if (i === 0 && lista.length > 2) tarjeta.classList.add('trabajo--destacada');
      if (i === 9 && lista.length > 12) tarjeta.classList.add('trabajo--destacada', 'trabajo--derecha');
      galeria.appendChild(tarjeta);
    });
    conteo.textContent = lista.length + (lista.length === 1 ? ' trabajo' : ' trabajos') + (grupoActivo === 'Todos' ? '' : ' de ' + grupoActivo);
  }

  // Cambio breve: se desvanece, se repinta y animaciones.js hace la entrada
  var temporizadorGaleria = null;
  function cambiarGaleria() {
    if (!galeria) return;
    if (movimientoReducido) { pintarGaleria(); avisar('galeria:pintada'); return; }
    clearTimeout(temporizadorGaleria);
    galeria.style.minHeight = galeria.offsetHeight + 'px';
    galeria.classList.add('galeria--cambiando');
    temporizadorGaleria = setTimeout(function () {
      pintarGaleria();
      galeria.classList.remove('galeria--cambiando');
      avisar('galeria:pintada');
      // Se suelta la altura después de la entrada para que el scroll no salte
      setTimeout(function () { galeria.style.minHeight = ''; avisar('pagina:medidas'); }, 450);
    }, 170);
  }

  pintarFiltros();
  pintarGaleria();

  /* ---------- Visor: reproduce el video dentro de la página ---------- */

  var visor = document.getElementById('visor');
  var visorMedia = document.getElementById('visor-media');
  var visorMarca = document.getElementById('visor-marca');
  var visorSub = document.getElementById('visor-sub');
  var visorEnlace = document.getElementById('visor-enlace');
  var vLista = [];
  var vIdx = 0;
  var vOrigen = null;

  function mostrarMensaje(texto) {
    visorMedia.textContent = '';
    visorMedia.appendChild(el('p', 'visor-mensaje', texto));
  }

  function mostrarMarco(src, clase, titulo) {
    visorMedia.textContent = '';
    var f = document.createElement('iframe');
    f.className = 'visor-iframe visor-iframe--' + clase;
    f.src = src;
    f.title = titulo;
    f.allow = 'encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('scrolling', 'no');
    visorMedia.appendChild(f);
  }

  // TikTok: si no tenemos el número largo del video, se intenta obtener automáticamente
  function buscarIdTikTok(item, listo) {
    if (item.tiktokId) { listo(item.tiktokId); return; }
    if (!window.fetch) { listo(''); return; }
    fetch('https://www.tiktok.com/oembed?url=' + encodeURIComponent(item.enlace))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var m = /data-video-id="(\d+)"/.exec((d && d.html) || '') || /player\/v1\/(\d+)/.exec((d && d.html) || '');
        item.tiktokId = (d && d.embed_product_id) || (m ? m[1] : '');
        listo(item.tiktokId);
      })
      .catch(function () { listo(''); });
  }

  function pintarVisor() {
    var it = vLista[vIdx];
    if (!it) return;
    visorMarca.textContent = it.marca;
    visorSub.textContent = it.sub + ' en ' + nombreRed(it) + (it.credito ? '. ' + it.credito : '');
    visorEnlace.href = it.enlace;
    visorEnlace.textContent = 'Ver en ' + nombreRed(it);

    if (it.red === 'instagram') {
      mostrarMarco(it.embed, 'instagram', it.marca + ', ' + it.sub);
    } else {
      mostrarMensaje('Cargando video…');
      buscarIdTikTok(it, function (id) {
        if (vLista[vIdx] !== it) return; // ya cambió de video
        if (id) {
          mostrarMarco('https://www.tiktok.com/player/v1/' + id + '?rel=0', 'tiktok', it.marca + ', ' + it.sub);
        } else {
          mostrarMensaje('Este video se ve mejor en TikTok. Usa el botón para abrirlo.');
        }
      });
    }
  }

  function abrirVisor(lista, idx) {
    if (!visor || typeof visor.showModal !== 'function') {
      window.open(lista[idx].enlace, '_blank', 'noopener');
      return;
    }
    vOrigen = document.activeElement;
    vLista = lista;
    vIdx = idx;
    pintarVisor();
    if (!visor.open) {
      visor.showModal();
      document.documentElement.classList.add('visor-abierto');
    }
  }

  function moverVisor(paso) {
    if (!vLista.length) return;
    vIdx = (vIdx + paso + vLista.length) % vLista.length;
    pintarVisor();
  }

  // Vacía el visor (detiene el video) y devuelve el foco a la tarjeta.
  // Se llama justo al cerrar, sin esperar al evento 'close', que puede
  // llegar tarde y borrar un video abierto después.
  var temporizadorVisor = null;
  function limpiarVisor() {
    clearTimeout(temporizadorVisor);
    temporizadorVisor = null;
    visor.classList.remove('visor--cerrando');
    visorMedia.textContent = '';
    vLista = [];
    document.documentElement.classList.remove('visor-abierto');
    if (vOrigen && document.contains(vOrigen)) vOrigen.focus({ preventScroll: true });
    vOrigen = null;
  }

  // Cierre con una salida breve; con movimiento reducido cierra al instante
  function cerrarVisor() {
    if (!visor.open || temporizadorVisor) return;
    if (movimientoReducido) { visor.close(); limpiarVisor(); return; }
    visor.classList.add('visor--cerrando');
    temporizadorVisor = setTimeout(function () {
      visor.close();
      limpiarVisor();
    }, 220);
  }

  if (visor) {
    document.getElementById('visor-cerrar').addEventListener('click', cerrarVisor);
    document.getElementById('visor-ant').addEventListener('click', function () { moverVisor(-1); });
    document.getElementById('visor-sig').addEventListener('click', function () { moverVisor(1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) cerrarVisor(); });
    // Escape: misma salida animada (si el navegador fuerza el cierre, 'close' limpia igual)
    visor.addEventListener('cancel', function (e) { e.preventDefault(); cerrarVisor(); });
    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') moverVisor(-1);
      if (e.key === 'ArrowRight') moverVisor(1);
    });
    // Cierres que no pasan por cerrarVisor (p. ej. Escape forzado por el navegador).
    // Si para entonces se abrió otro video, no se toca.
    visor.addEventListener('close', function () {
      if (!visor.open) limpiarVisor();
    });
  }

  /* ---------- Cambio automático (servicios y testimonios) ----------
     Avanza solo cada cierto tiempo mientras el bloque está en pantalla y
     dibuja el tiempo restante en una barra (--avance de 0 a 1).
     También se detiene con la pestaña del navegador oculta, con el
     reproductor abierto o durante el loader.
     Cada bloque decide sus propias pausas con pausar(motivo, activa):
     - Servicios: en PC un clic pausa y otro reanuda; en celular se pausa
       mientras el dedo está sobre el bloque y sigue al soltarlo.
     - Testimonios: sin pausas, siempre cambia.
     Con movimiento reducido no cambia solo (preferencia del sistema). */

  function crearRotador(cfg) {
    var transcurrido = 0;
    var previo = 0;
    var raf = 0;
    var visible = false;
    var pausas = { reducido: movimientoReducido };

    function enPausa() {
      if (document.hidden) return true;
      if (/(^|\s)(visor-abierto|cargando)(\s|$)/.test(document.documentElement.className)) return true;
      return Object.keys(pausas).some(function (k) { return pausas[k]; });
    }

    function actualizar() {
      if (cfg.zona) cfg.zona.setAttribute('data-estado', enPausa() ? 'pausa' : 'corriendo');
    }

    function pintar() { cfg.pintar(Math.min(1, transcurrido / cfg.duracion)); }

    function cuadro(t) {
      raf = 0;
      if (!visible) return;
      if (!enPausa()) {
        transcurrido += Math.min(100, t - previo);
        if (transcurrido >= cfg.duracion) {
          transcurrido = 0;
          cfg.avanzar();
        }
      }
      previo = t;
      pintar();
      raf = requestAnimationFrame(cuadro);
    }

    function arrancar() {
      if (raf || !visible) return;
      previo = performance.now();
      raf = requestAnimationFrame(cuadro);
    }

    document.addEventListener('visibilitychange', actualizar);
    // El reproductor y el loader cambian clases de <html>
    new MutationObserver(actualizar).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Solo corre mientras el bloque se ve en pantalla
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        var e = entradas[0];
        visible = e.isIntersecting && e.intersectionRatio >= cfg.umbral;
        if (visible) arrancar();
      }, { threshold: [0, cfg.umbral] }).observe(cfg.observado);
    }

    actualizar();
    pintar();
    return {
      pausar: function (motivo, activa) { pausas[motivo] = activa; actualizar(); },
      alternar: function (motivo) { pausas[motivo] = !pausas[motivo]; actualizar(); },
      reiniciar: function () { transcurrido = 0; pintar(); }
    };
  }

  /* ---------- Mi sistema de trabajo (pestañas) ---------- */

  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var listaTabs = document.querySelector('.tabs');
  var zonaSistema = document.getElementById('sistema-zona');
  var rotadorServicios = null;
  var ultimoToque = 0; // para ignorar el clic que el celular genera tras un toque

  function seleccionarTab(i, enfocar) {
    tabs.forEach(function (t, j) {
      var activa = j === i;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !activa;
    });
    if (enfocar) tabs[i].focus();
    avisar('pagina:medidas');
  }

  function tabActiva() {
    for (var i = 0; i < tabs.length; i++) if (tabs[i].getAttribute('aria-selected') === 'true') return i;
    return 0;
  }

  function vieneDeToque() { return Date.now() - ultimoToque < 800; }

  // Elegir un servicio con mouse o teclado lo deja en pausa para leerlo;
  // en celular solo lo muestra y el tiempo vuelve a empezar
  function elegirTab(i, enfocar) {
    seleccionarTab(i, enfocar);
    if (!rotadorServicios) return;
    rotadorServicios.reiniciar();
    if (!vieneDeToque()) rotadorServicios.pausar('usuario', true);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      // Clic en la pestaña que ya está activa: pausa / reanuda
      if (i === tabActiva() && rotadorServicios && !vieneDeToque()) {
        rotadorServicios.alternar('usuario');
        return;
      }
      elegirTab(i, false);
    });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length;
      var destino = -1;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') destino = (i + 1) % n;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') destino = (i - 1 + n) % n;
      else if (e.key === 'Home') destino = 0;
      else if (e.key === 'End') destino = n - 1;
      if (destino >= 0) {
        e.preventDefault();
        elegirTab(destino, true);
      }
    });
  });

  if (zonaSistema && listaTabs && tabs.length > 1) {
    rotadorServicios = crearRotador({
      // Cada panel tiene entre 75 y 115 palabras: 25 s alcanzan para leerlo
      duracion: 25000,
      zona: zonaSistema,
      // En celular el panel queda debajo de las pestañas: si ya no se ven,
      // la persona está leyendo el panel y no se cambia
      observado: listaTabs,
      umbral: 0.6,
      avanzar: function () { seleccionarTab((tabActiva() + 1) % tabs.length, false); },
      pintar: function (v) { listaTabs.style.setProperty('--avance', v.toFixed(4)); }
    });

    // Celular: pausa mientras el dedo está sobre el bloque y sigue al soltarlo
    zonaSistema.addEventListener('touchstart', function () {
      ultimoToque = Date.now();
      rotadorServicios.pausar('dedo', true);
    }, { passive: true });
    ['touchend', 'touchcancel'].forEach(function (tipo) {
      zonaSistema.addEventListener(tipo, function (e) {
        ultimoToque = Date.now();
        if (!e.touches.length) rotadorServicios.pausar('dedo', false);
      }, { passive: true });
    });

    // PC: un clic en el panel pausa y otro reanuda (sin contar enlaces y botones)
    zonaSistema.querySelector('.paneles').addEventListener('click', function (e) {
      if (vieneDeToque() || e.target.closest('a, button')) return;
      // Seleccionar texto no cuenta como clic
      if (window.getSelection && String(window.getSelection()).length) return;
      rotadorServicios.alternar('usuario');
    });
  }

  /* ---------- Testimonios (pila deslizable) ---------- */

  var pila = document.getElementById('pila');
  if (pila) {
    var tarjetas = [].slice.call(pila.querySelectorAll('.tarjeta'));
    var total = tarjetas.length;
    var actual = 0;
    var contador = document.getElementById('pila-contador');
    var contPuntos = document.getElementById('pila-puntos');
    var puntos = [];
    var rotadorTestimonios = null;

    tarjetas.forEach(function (t, i) {
      var p = el('button', 'punto-pila');
      p.type = 'button';
      p.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1) + ' de ' + total);
      p.addEventListener('click', function () { irManual(i); });
      contPuntos.appendChild(p);
      puntos.push(p);
    });

    var pintarPila = function () {
      tarjetas.forEach(function (t, i) {
        var pos = (i - actual + total) % total;
        t.setAttribute('data-pos', String(Math.min(pos, 3)));
        t.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true');
        if (pos === 0) t.removeAttribute('inert'); else t.setAttribute('inert', '');
      });
      puntos.forEach(function (p, i) { p.setAttribute('aria-current', String(i === actual)); });
      contador.textContent = (actual + 1) + ' de ' + total;
    };

    // El cambio automático no se anuncia a lectores de pantalla cada 7 s;
    // el cambio hecho a mano sí
    var irA = function (i, automatico) {
      contador.setAttribute('aria-live', automatico ? 'off' : 'polite');
      actual = (i + total) % total;
      pintarPila();
    };
    // Elegir a mano no detiene el cambio: el tiempo vuelve a empezar
    var irManual = function (i) {
      irA(i, false);
      if (rotadorTestimonios) rotadorTestimonios.reiniciar();
    };

    document.getElementById('pila-ant').addEventListener('click', function () { irManual(actual - 1); });
    document.getElementById('pila-sig').addEventListener('click', function () { irManual(actual + 1); });

    // Flechas del teclado mientras el foco está en la sección de testimonios
    var zonaTestimonios = document.getElementById('testimonios');
    zonaTestimonios.addEventListener('keydown', function (e) {
      if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); irManual(actual - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); irManual(actual + 1); }
    });

    if (total > 1) {
      rotadorTestimonios = crearRotador({
        // Testimonios cortos (14 a 28 palabras)
        duracion: 5000,
        observado: pila,
        umbral: 0.5,
        avanzar: function () { irA(actual + 1, true); },
        pintar: function (v) { contPuntos.style.setProperty('--avance', v.toFixed(4)); }
      });
    }

    // Deslizar con el dedo o arrastrar con el mouse
    var inicioX = null;
    pila.addEventListener('pointerdown', function (e) { inicioX = e.clientX; });
    var terminar = function (e) {
      if (inicioX === null) return;
      var dx = e.clientX - inicioX;
      inicioX = null;
      if (dx < -40) irManual(actual + 1);
      else if (dx > 40) irManual(actual - 1);
    };
    pila.addEventListener('pointerup', terminar);
    pila.addEventListener('pointercancel', function () { inicioX = null; });

    pintarPila();
  }

  /* ---------- Menú en celular ---------- */

  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');

  function cerrarMenu() {
    if (!menu.classList.contains('abierto')) return;
    menu.classList.remove('abierto');
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-abierto');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', String(abierto));
      document.documentElement.classList.toggle('menu-abierto', abierto);
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) cerrarMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('abierto')) { cerrarMenu(); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1000) cerrarMenu(); });
  }

  /* ---------- Enlaces internos con desplazamiento suave ----------
     Se hace aquí y no con scroll-behavior: smooth en el CSS, porque esa
     regla también suaviza los saltos internos de ScrollTrigger al
     recalcular y deja las escenas fijas en el lugar equivocado. */

  function posicionDe(destino) {
    var margen = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    var maximo = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(maximo, Math.max(0, destino.getBoundingClientRect().top + window.pageYOffset - margen));
  }
  function irASeccion(destino, comportamiento) {
    window.scrollTo({ top: posicionDe(destino), behavior: comportamiento });
  }
  var soltarRevision = null; // revisión del último enlace pulsado

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var destino = id && document.getElementById(id);
    if (!destino) return;
    e.preventDefault();
    if (soltarRevision) soltarRevision();
    irASeccion(destino, movimientoReducido ? 'auto' : 'smooth');
    // Si algo corta el recorrido (la página recalcula sus medidas a mitad
    // de camino), se termina de llegar cuando el scroll se detiene
    // (si la persona mueve la rueda o el dedo, manda ella y no se corrige)
    var soltar = function () {
      clearTimeout(revisar.t);
      window.removeEventListener('scroll', revisar);
      ['wheel', 'touchstart', 'keydown'].forEach(function (t) { window.removeEventListener(t, soltar); });
    };
    var revisar = function () {
      clearTimeout(revisar.t);
      revisar.t = setTimeout(function () {
        soltar();
        if (Math.abs(posicionDe(destino) - window.pageYOffset) > 4) irASeccion(destino, 'auto');
      }, 220);
    };
    window.addEventListener('scroll', revisar, { passive: true });
    ['wheel', 'touchstart', 'keydown'].forEach(function (t) { window.addEventListener(t, soltar, { passive: true }); });
    soltarRevision = soltar;
    revisar();
    if (history.pushState) history.pushState(null, '', '#' + id);
    // "Saltar al portafolio": el foco del teclado también pasa al destino
    if (a.classList.contains('saltar')) {
      if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1');
      destino.focus({ preventScroll: true });
    }
  });

  /* ---------- Encabezado: fondo al bajar, tema claro/oscuro y sección activa ---------- */

  var cabecera = document.getElementById('cabecera');
  if (cabecera && 'IntersectionObserver' in window) {
    // Fondo sólido cuando la página ya no está arriba del todo
    var centinela = el('div', 'centinela');
    centinela.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(centinela, document.body.firstChild);
    new IntersectionObserver(function (e) {
      cabecera.classList.toggle('cabecera--scroll', !e[0].isIntersecting);
    }).observe(centinela);

    // Tema oscuro cuando la franja del encabezado pasa sobre una sección oscura
    var oscuras = [].slice.call(document.querySelectorAll('[data-tema="oscuro"]'));
    var encima = {};
    var obsTema = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { encima[en.target.id] = en.isIntersecting; });
      var hayOscura = Object.keys(encima).some(function (k) { return encima[k]; });
      cabecera.classList.toggle('cabecera--oscura', hayOscura);
    }, { rootMargin: '-56px 0px -90% 0px' });
    oscuras.forEach(function (s) { obsTema.observe(s); });

    // Enlace activo según la sección que ocupa el centro de la pantalla
    var enlaces = [].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
    var porId = {};
    enlaces.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });
    var obsSeccion = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var a = porId[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          enlaces.forEach(function (x) { x.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        } else if (a.getAttribute('aria-current')) {
          a.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(porId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) obsSeccion.observe(s);
    });
  }

  /* ---------- Formulario: abre WhatsApp con el mensaje listo ---------- */

  var formulario = document.getElementById('formulario');
  if (formulario) {
    var error = document.getElementById('formulario-error');
    var estado = document.getElementById('formulario-estado');
    var campos = [formulario.elements.nombre, formulario.elements.mensaje];

    campos.forEach(function (c) {
      c.addEventListener('input', function () {
        if (c.value.trim()) c.removeAttribute('aria-invalid');
      });
    });

    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = formulario.elements.nombre.value.trim();
      var negocio = formulario.elements.negocio.value.trim();
      var mensaje = formulario.elements.mensaje.value.trim();

      estado.textContent = '';
      var faltan = campos.filter(function (c) { return !c.value.trim(); });
      campos.forEach(function (c) {
        if (faltan.indexOf(c) === -1) c.removeAttribute('aria-invalid');
        else c.setAttribute('aria-invalid', 'true');
      });
      if (faltan.length) {
        error.hidden = false;
        faltan[0].focus();
        return;
      }
      error.hidden = true;

      var texto = 'Hola Juan, soy ' + nombre + (negocio ? ' de ' + negocio : '') + '. ' + mensaje;
      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
      window.open(url, '_blank', 'noopener');

      // No se confirma un envío: el mensaje se envía desde WhatsApp
      estado.appendChild(document.createTextNode('Abrimos WhatsApp con tu mensaje listo: solo falta presionar enviar allí. '));
      var alterno = el('a', '', 'Si no se abrió, toca aquí.');
      alterno.href = url;
      alterno.target = '_blank';
      alterno.rel = 'noopener';
      estado.appendChild(alterno);
    });
  }

  /* ---------- Año del pie de página ---------- */

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();

/* ============================================================
   Juan Calle Marketing — comportamiento de la página

   Para agregar o cambiar videos y piezas, edita la lista
   "PORTAFOLIO" y "PRINCIPALES" de más abajo.
   Cada trabajo necesita su portada en la carpeta assets/portadas/
   (el nombre del archivo va en el campo "portada", sin el .jpg).
   ============================================================ */

(function () {
  'use strict';

  var WHATSAPP = '573053247075';
  var CARPETA_PORTADAS = 'assets/portadas/';

  /* ---------- Formas de enlazar cada red ---------- */

  // Instagram: reel o publicación. "codigo" es lo que va después de /reel/ o /p/
  function instagram(codigo, tipo) {
    var ruta = tipo === 'Publicación' ? 'p' : 'reel';
    var base = 'https://www.instagram.com/' + ruta + '/' + codigo + '/';
    return { red: 'instagram', tipo: tipo || 'Reel', enlace: base, embed: base + 'embed/' };
  }

  // TikTok: "corto" es el código del enlace vt.tiktok.com.
  // Si tienes el número largo del video (el del enlace completo
  // tiktok.com/@usuario/video/NUMERO), agrégalo en "id" para que cargue más rápido.
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
    trabajo({ marca: 'Celu Antioquia', portada: 'celu-antioquia', credito: 'Formato propio', principal: true }, tiktok('ZSgBmtGR2')),
    trabajo({ marca: 'Before', portada: 'before', credito: CB, principal: true }, tiktok('ZSgBmTXgg'))
  ];

  /* ---------- Portafolio ---------- */

  var PORTAFOLIO = [
    // Abogado Sergio
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-1' }, instagram('DdU76rrtBrV')),
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-2' }, instagram('DbWucQkta0x')),
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-3' }, instagram('DdnBfa2tDfe')),
    trabajo({ marca: 'Abogado Sergio', portada: 'abogado-sergio-4' }, instagram('DdC-FBINdj1')),
    // ZenKon
    trabajo({ marca: 'ZenKon', portada: 'zenkon-1' }, instagram('DTTIaj0D8a8')),
    trabajo({ marca: 'ZenKon', portada: 'zenkon-2' }, instagram('Da0Txu7tvSH')),
    trabajo({ marca: 'ZenKon', portada: 'zenkon-3' }, instagram('Dbvo2rSupMo')),
    trabajo({ marca: 'ZenKon', portada: 'zenkon-4' }, instagram('DdWzJYvFBtj', 'Publicación')),
    // Videos que edité para CB Studio
    trabajo({ marca: 'Íntimas', portada: 'intimas-1', credito: CB }, tiktok('ZSgBukAxB')),
    trabajo({ marca: 'Íntimas', portada: 'intimas-2', credito: CB }, tiktok('ZSgBunEMS')),
    trabajo({ marca: 'Íntimas', portada: 'intimas-3', credito: CB }, tiktok('ZSgBuvtaD')),
    trabajo({ marca: 'Malawy', portada: 'malawy-1', credito: CB }, tiktok('ZSgBHR7tG')),
    trabajo({ marca: 'Malawy', portada: 'malawy-2', credito: CB }, instagram('Dd49LauhWRi')),
    trabajo({ marca: 'Magno', portada: 'magno-1', credito: CB }, instagram('Ddm95IwzETk')),
    trabajo({ marca: 'Magno', portada: 'magno-2', credito: CB }, instagram('Dc2IkIHzUqO')),
    trabajo({ marca: 'Magno', portada: 'magno-3', credito: CB }, instagram('Dd49uUYzpnC')),
    trabajo({ marca: 'Renuevo', portada: 'renuevo-1', credito: CB }, instagram('DdFoZbbNaXs'))
  ];

  /* ---------- Utilidades ---------- */

  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
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

  function crearTarjeta(item, lista) {
    var art = el('article', 'trabajo');

    var ph = el('span', 'trabajo-ph', item.marca);
    ph.setAttribute('aria-hidden', 'true');
    art.appendChild(ph);

    var img = document.createElement('img');
    img.className = 'trabajo-portada';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = item.portada;
    img.addEventListener('error', function () {
      art.classList.add('sin-portada');
      img.remove();
    });
    art.appendChild(img);

    art.appendChild(el('span', 'trabajo-sombra'));

    var red = el('span', 'trabajo-red');
    red.innerHTML = item.red === 'instagram' ? ICONO_IG : ICONO_TT;
    red.appendChild(document.createTextNode(nombreRed(item)));
    art.appendChild(red);

    var abrir = el('button', 'trabajo-abrir');
    abrir.type = 'button';
    abrir.setAttribute('aria-label', 'Reproducir ' + item.marca + ', ' + item.sub);
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
    info.appendChild(enlace);
    art.appendChild(info);

    return art;
  }

  /* ---------- Inicio: videos principales ---------- */

  var heroVideos = document.getElementById('hero-videos');
  if (heroVideos) {
    PRINCIPALES.forEach(function (t) { heroVideos.appendChild(crearTarjeta(t, PRINCIPALES)); });
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
        grupoActivo = g;
        pintarFiltros();
        pintarGaleria();
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
    lista.forEach(function (t) { galeria.appendChild(crearTarjeta(t, lista)); });
    conteo.textContent = lista.length + (lista.length === 1 ? ' trabajo' : ' trabajos');
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
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
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
        var m = /data-video-id="(\d+)"/.exec((d && d.html) || '');
        item.tiktokId = m ? m[1] : '';
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
    vLista = lista;
    vIdx = idx;
    pintarVisor();
    if (!visor.open) visor.showModal();
  }

  function moverVisor(paso) {
    if (!vLista.length) return;
    vIdx = (vIdx + paso + vLista.length) % vLista.length;
    pintarVisor();
  }

  if (visor) {
    document.getElementById('visor-cerrar').addEventListener('click', function () { visor.close(); });
    document.getElementById('visor-ant').addEventListener('click', function () { moverVisor(-1); });
    document.getElementById('visor-sig').addEventListener('click', function () { moverVisor(1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });
    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') moverVisor(-1);
      if (e.key === 'ArrowRight') moverVisor(1);
    });
    // Al cerrar se vacía el visor para detener el video
    visor.addEventListener('close', function () {
      visorMedia.textContent = '';
      vLista = [];
    });
  }

  /* ---------- Mi sistema de trabajo (pestañas) ---------- */

  var tabs = [].slice.call(document.querySelectorAll('.tab'));

  function seleccionarTab(i, enfocar) {
    tabs.forEach(function (t, j) {
      var activa = j === i;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !activa;
    });
    if (enfocar) tabs[i].focus();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { seleccionarTab(i, false); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length;
      var destino = -1;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') destino = (i + 1) % n;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') destino = (i - 1 + n) % n;
      else if (e.key === 'Home') destino = 0;
      else if (e.key === 'End') destino = n - 1;
      if (destino >= 0) {
        e.preventDefault();
        seleccionarTab(destino, true);
      }
    });
  });

  /* ---------- Testimonios (pila deslizable) ---------- */

  var pila = document.getElementById('pila');
  if (pila) {
    var tarjetas = [].slice.call(pila.querySelectorAll('.tarjeta'));
    var total = tarjetas.length;
    var actual = 0;
    var contador = document.getElementById('pila-contador');
    var contPuntos = document.getElementById('pila-puntos');
    var puntos = [];

    tarjetas.forEach(function (t, i) {
      var p = el('button', 'punto-pila');
      p.type = 'button';
      p.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      p.addEventListener('click', function () { irA(i); });
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

    var irA = function (i) { actual = (i + total) % total; pintarPila(); };

    document.getElementById('pila-ant').addEventListener('click', function () { irA(actual - 1); });
    document.getElementById('pila-sig').addEventListener('click', function () { irA(actual + 1); });

    // Deslizar con el dedo o arrastrar con el mouse
    var inicioX = null;
    pila.addEventListener('pointerdown', function (e) { inicioX = e.clientX; });
    var terminar = function (e) {
      if (inicioX === null) return;
      var dx = e.clientX - inicioX;
      inicioX = null;
      if (dx < -40) irA(actual + 1);
      else if (dx > 40) irA(actual - 1);
    };
    pila.addEventListener('pointerup', terminar);
    pila.addEventListener('pointercancel', function () { inicioX = null; });

    pintarPila();
  }

  /* ---------- Menú en celular ---------- */

  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');

  function cerrarMenu() {
    menu.classList.remove('abierto');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', String(abierto));
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) cerrarMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });
  }

  /* ---------- Formulario: abre WhatsApp con el mensaje listo ---------- */

  var formulario = document.getElementById('formulario');
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = formulario.elements.nombre.value.trim();
      var negocio = formulario.elements.negocio.value.trim();
      var mensaje = formulario.elements.mensaje.value.trim();
      var error = document.getElementById('formulario-error');

      if (!nombre || !mensaje) {
        error.hidden = false;
        return;
      }
      error.hidden = true;

      var texto = 'Hola Juan, soy ' + nombre + (negocio ? ' de ' + negocio : '') + '. ' + mensaje;
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
  }

  /* ---------- Año del pie de página ---------- */

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();

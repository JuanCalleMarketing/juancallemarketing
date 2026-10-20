/*
  ============================================================
  AQUÍ ADMINISTRAS TU PORTAFOLIO
  ============================================================
  Cada trabajo es un bloque entre llaves { ... } separado por comas.
  Para agregar uno nuevo, copia un bloque completo, pégalo debajo y cambia los datos.
  Para quitar uno, borra el bloque completo.

  CAMPOS
  tipo         "video" para videos y reels, "pieza" para piezas gráficas.
  marca        Nombre de la marca. Los filtros se arman solos con estos nombres.
  titulo       Nombre corto del trabajo.
  descripcion  Una o dos frases (opcional).
  formato      Forma de la vista previa: "vertical" (9:16), "retrato" (4:5),
               "cuadrado" (1:1) o "horizontal" (16:9).
  destacado    true si quieres que aparezca en la parte de arriba de la página
               (usa true en 3 trabajos).
  colores      Dos colores que se ven mientras falta el archivo (opcional).

  PARA VIDEOS (elige una de las dos opciones)
  archivo      Ruta del video dentro del proyecto. Ej: "assets/videos/zenkon-reel.mp4"
  youtube      Código del video de YouTube (lo que va después de v= en el enlace).
  portada      Imagen de portada del video (opcional). Ej: "assets/posters/zenkon-reel.jpg"

  PARA PIEZAS GRÁFICAS
  archivos     Lista de imágenes. Con una sola se ve la imagen; con varias, un carrusel.
               Ej: ["assets/piezas/zenkon-1.jpg", "assets/piezas/zenkon-2.jpg"]

  Mientras un archivo no exista en la carpeta, verás un cuadro de color con la
  etiqueta "Ejemplo". Cuando subas el archivo real, la etiqueta desaparece sola.
*/

window.PORTAFOLIO = [
  {
    tipo: "video",
    marca: "ZenKon",
    titulo: "Reel de presentación",
    descripcion: "Video corto para mostrar el acabado en microconcreto.",
    formato: "vertical",
    archivo: "assets/videos/zenkon-reel-01.mp4",
    portada: "assets/posters/zenkon-reel-01.jpg",
    destacado: true,
    colores: ["#2342F0", "#0F1218"]
  },
  {
    tipo: "pieza",
    marca: "ZenKon",
    titulo: "Línea de acabados",
    descripcion: "Serie de piezas para redes.",
    formato: "cuadrado",
    archivos: ["assets/piezas/zenkon-01.jpg", "assets/piezas/zenkon-02.jpg"],
    destacado: true,
    colores: ["#5B6472", "#0F1218"]
  },
  {
    tipo: "video",
    marca: "Enchilaitos",
    titulo: "Anuncio de gomitas enchiladas",
    descripcion: "Video pensado para pauta en Meta Ads.",
    formato: "vertical",
    archivo: "assets/videos/enchilaitos-anuncio-01.mp4",
    portada: "assets/posters/enchilaitos-anuncio-01.jpg",
    destacado: true,
    colores: ["#D6342C", "#0F1218"]
  },
  {
    tipo: "pieza",
    marca: "Capolusso",
    titulo: "Colección de hoodies",
    descripcion: "Pieza para lanzamiento de colección.",
    formato: "retrato",
    archivos: ["assets/piezas/capolusso-01.jpg"],
    colores: ["#1B1F2A", "#6B4EFF"]
  },
  {
    tipo: "video",
    marca: "Vamos Travel",
    titulo: "Destino del mes",
    descripcion: "Reel de destino para redes.",
    formato: "vertical",
    archivo: "assets/videos/vamos-travel-destino-01.mp4",
    colores: ["#0E7C86", "#0F1218"]
  },
  {
    tipo: "pieza",
    marca: "Legal Pets",
    titulo: "Contenido informativo",
    descripcion: "Pieza educativa para dueños de mascotas.",
    formato: "cuadrado",
    archivos: ["assets/piezas/legal-pets-01.jpg"],
    colores: ["#2F7D5B", "#0F1218"]
  },
  {
    tipo: "video",
    marca: "La Vete",
    titulo: "Presentación de la clínica",
    descripcion: "Video horizontal de presentación.",
    formato: "horizontal",
    archivo: "assets/videos/la-vete-clinica-01.mp4",
    colores: ["#3B82F6", "#0F1218"]
  },
  {
    tipo: "pieza",
    marca: "Sergio Abogado",
    titulo: "Derecho médico",
    descripcion: "Pieza para posicionar la especialidad.",
    formato: "retrato",
    archivos: ["assets/piezas/sergio-abogado-01.jpg"],
    colores: ["#2A3244", "#2342F0"]
  },
  {
    tipo: "pieza",
    marca: "Inmobiliaria DP",
    titulo: "Proyecto exclusivo",
    descripcion: "Pieza para captar interesados.",
    formato: "cuadrado",
    archivos: ["assets/piezas/inmobiliaria-dp-01.jpg"],
    colores: ["#8A6A2F", "#0F1218"]
  }
];


/* Juan Calle Marketing — comportamiento de la página
   Aquí NO necesitas cambiar nada para agregar trabajos al portafolio:
   eso se hace en js/portafolio-datos.js */

(function () {
  "use strict";

  var WHATSAPP = "573053247075";
  var TIPOS = [
    { id: "todo", texto: "Todo" },
    { id: "video", texto: "Videos" },
    { id: "pieza", texto: "Piezas gráficas" }
  ];

  var datos = (Array.isArray(window.PORTAFOLIO) ? window.PORTAFOLIO : []).filter(function (i) {
    return i && i.marca;
  });
  var estado = { tipo: "todo", marca: "todas" };
  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Utilidades ---------- */

  function crear(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function formatoDe(item) {
    return item.formato || (item.tipo === "video" ? "vertical" : "cuadrado");
  }

  function imagenesDe(item) {
    if (Array.isArray(item.archivos) && item.archivos.length) return item.archivos;
    if (item.tipo === "pieza" && item.archivo) return [item.archivo];
    return [];
  }

  function portadaYoutube(id) {
    return "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg";
  }

  function nuevaImagen(src, alt) {
    var img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = alt || "";
    img.src = src;
    return img;
  }

  /* ---------- Tarjetas del portafolio ---------- */

  function crearTile(item) {
    var esVideo = item.tipo === "video";
    var boton = crear("button", "tile");
    boton.type = "button";
    boton.dataset.formato = formatoDe(item);
    boton.setAttribute(
      "aria-label",
      "Ver " + (esVideo ? "video" : "pieza") + ": " + (item.titulo || item.marca) + ", " + item.marca
    );

    var medio = crear("span", "tile-medio");
    medio.style.setProperty("--c1", (item.colores && item.colores[0]) || "#2342F0");
    medio.style.setProperty("--c2", (item.colores && item.colores[1]) || "#0F1218");
    boton.appendChild(medio);

    var video = null;

    // Si falta el archivo, se muestra un cuadro de color con la etiqueta "Ejemplo".
    function mostrarEjemplo() {
      if (medio.classList.contains("es-ejemplo")) return;
      medio.classList.add("es-ejemplo");
      Array.prototype.slice.call(medio.querySelectorAll("img, video")).forEach(function (n) {
        n.remove();
      });
      video = null;
      medio.appendChild(crear("span", "tile-ph", item.marca));
      medio.appendChild(crear("span", "tile-badge", "Ejemplo"));
    }

    var imagenes = imagenesDe(item);

    if (esVideo && item.youtube) {
      var miniatura = nuevaImagen(item.portada || portadaYoutube(item.youtube), "");
      miniatura.addEventListener("error", mostrarEjemplo);
      medio.appendChild(miniatura);
    } else if (esVideo && item.archivo) {
      video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.preload = item.portada ? "none" : "metadata";
      if (item.portada) video.poster = item.portada;
      video.src = item.archivo + (item.portada ? "" : "#t=0.1");
      video.addEventListener("error", mostrarEjemplo);
      medio.appendChild(video);
    } else if (!esVideo && imagenes.length) {
      var foto = nuevaImagen(imagenes[0], "");
      foto.addEventListener("error", mostrarEjemplo);
      medio.appendChild(foto);
    } else {
      mostrarEjemplo();
    }

    // Etiqueta pequeña arriba a la derecha
    var pill;
    if (esVideo) {
      pill = crear("span", "tile-pill es-video");
      pill.appendChild(crear("span", null, "Video"));
    } else if (imagenes.length > 1) {
      pill = crear("span", "tile-pill");
      pill.appendChild(crear("span", null, imagenes.length + " imágenes"));
    }
    if (pill) {
      pill.setAttribute("aria-hidden", "true");
      medio.appendChild(pill);
    }

    var info = crear("span", "tile-info");
    info.appendChild(crear("span", "tile-nombre", item.marca));
    if (item.titulo) info.appendChild(crear("span", "tile-titulo", item.titulo));
    boton.appendChild(info);

    // Vista previa del video al pasar el mouse
    if (video && !sinMovimiento) {
      var reproducir = function () {
        if (!video) return;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      };
      var detener = function () {
        if (!video) return;
        video.pause();
        try { video.currentTime = 0; } catch (e) { /* sin acción */ }
      };
      boton.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "mouse") reproducir();
      });
      boton.addEventListener("pointerleave", detener);
      boton.addEventListener("focus", reproducir);
      boton.addEventListener("blur", detener);
    }

    boton.addEventListener("click", function () {
      abrirVisor(item);
    });

    return boton;
  }

  /* ---------- Filtros y galería ---------- */

  var galeria = document.getElementById("galeria");
  var conteo = document.getElementById("conteo");
  var filtrosTipo = document.getElementById("filtros-tipo");
  var filtrosMarca = document.getElementById("filtros-marca");

  function marcasUnicas() {
    var vistas = [];
    datos.forEach(function (i) {
      if (vistas.indexOf(i.marca) === -1) vistas.push(i.marca);
    });
    return vistas;
  }

  function crearFiltro(texto, grupo, valor) {
    var b = crear("button", "filtro", texto);
    b.type = "button";
    b.dataset.valor = valor;
    b.setAttribute("aria-pressed", String(estado[grupo] === valor));
    b.addEventListener("click", function () {
      estado[grupo] = valor;
      pintarFiltros();
      pintarGaleria();
    });
    return b;
  }

  function pintarFiltros() {
    if (!filtrosTipo || !filtrosMarca) return;
    filtrosTipo.textContent = "";
    filtrosMarca.textContent = "";
    TIPOS.forEach(function (t) {
      filtrosTipo.appendChild(crearFiltro(t.texto, "tipo", t.id));
    });
    filtrosMarca.appendChild(crearFiltro("Todas las marcas", "marca", "todas"));
    marcasUnicas().forEach(function (m) {
      filtrosMarca.appendChild(crearFiltro(m, "marca", m));
    });
  }

  function pintarGaleria() {
    if (!galeria) return;
    galeria.textContent = "";

    var lista = datos.filter(function (i) {
      var okTipo = estado.tipo === "todo" || i.tipo === estado.tipo;
      var okMarca = estado.marca === "todas" || i.marca === estado.marca;
      return okTipo && okMarca;
    });

    if (!lista.length) {
      var vacio = crear("div", "galeria-vacia");
      vacio.appendChild(crear("p", null, "No hay trabajos con esta combinación. Prueba con otra marca o con “Todo”."));
      var reiniciar = crear("button", "filtro", "Ver todo el portafolio");
      reiniciar.type = "button";
      reiniciar.addEventListener("click", function () {
        estado.tipo = "todo";
        estado.marca = "todas";
        pintarFiltros();
        pintarGaleria();
      });
      vacio.appendChild(reiniciar);
      galeria.appendChild(vacio);
      conteo.textContent = "0 trabajos";
      return;
    }

    lista.forEach(function (item) {
      galeria.appendChild(crearTile(item));
    });
    conteo.textContent = lista.length + (lista.length === 1 ? " trabajo" : " trabajos");
  }

  /* ---------- Trabajos destacados (parte de arriba) ---------- */

  function pintarHero() {
    var cont = document.getElementById("hero-collage");
    var grilla = document.getElementById("hero-grilla");
    if (!cont) return;

    var elegidos = datos.filter(function (i) { return i.destacado; });
    datos.forEach(function (i) {
      if (elegidos.length < 3 && elegidos.indexOf(i) === -1) elegidos.push(i);
    });
    elegidos = elegidos.slice(0, 3);

    if (!elegidos.length) {
      cont.hidden = true;
      if (grilla) grilla.classList.add("sin-collage");
      return;
    }

    var col1 = crear("div", "hero-col");
    var col2 = crear("div", "hero-col");
    elegidos.forEach(function (item, i) {
      var t = crearTile(item);
      t.style.setProperty("--i", i);
      (i === 0 ? col1 : col2).appendChild(t);
    });
    cont.appendChild(col1);
    if (col2.childNodes.length) cont.appendChild(col2);
  }

  /* ---------- Visor ---------- */

  var visor = document.getElementById("visor");
  var visorMedia = document.getElementById("visor-media");
  var visorNav = document.getElementById("visor-nav");
  var visorContador = document.getElementById("visor-contador");
  var visorItem = null;
  var visorIdx = 0;

  function mostrarAusente() {
    visorMedia.textContent = "";
    visorMedia.appendChild(
      crear("p", "visor-ausente", "Este archivo todavía no está en la carpeta del proyecto. Súbelo y vuelve a cargar la página.")
    );
  }

  function pintarVisor() {
    var item = visorItem;
    var esVideo = item.tipo === "video";
    var imagenes = imagenesDe(item);
    visorMedia.textContent = "";

    if (esVideo && item.youtube) {
      var f = document.createElement("iframe");
      f.className = "visor-iframe";
      f.dataset.formato = formatoDe(item);
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(item.youtube) + "?autoplay=1&rel=0&playsinline=1";
      f.title = item.titulo || item.marca;
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      visorMedia.appendChild(f);
    } else if (esVideo && item.archivo) {
      var v = document.createElement("video");
      v.className = "visor-video";
      v.controls = true;
      v.autoplay = true;
      v.loop = true;
      v.playsInline = true;
      if (item.portada) v.poster = item.portada;
      v.src = item.archivo;
      v.addEventListener("error", mostrarAusente);
      visorMedia.appendChild(v);
    } else if (!esVideo && imagenes.length) {
      var im = nuevaImagen(imagenes[visorIdx], (item.titulo || item.marca));
      im.className = "visor-imagen";
      im.loading = "eager";
      im.addEventListener("error", mostrarAusente);
      visorMedia.appendChild(im);
    } else {
      mostrarAusente();
    }

    var varias = !esVideo && imagenes.length > 1;
    visorNav.hidden = !varias;
    if (varias) visorContador.textContent = (visorIdx + 1) + " de " + imagenes.length;

    document.getElementById("visor-marca").textContent = item.marca;
    document.getElementById("visor-titulo").textContent = item.titulo || "";
    document.getElementById("visor-desc").textContent = item.descripcion || "";
  }

  function moverVisor(paso) {
    if (!visorItem) return;
    var total = imagenesDe(visorItem).length;
    if (total < 2) return;
    visorIdx = (visorIdx + paso + total) % total;
    pintarVisor();
  }

  function abrirVisor(item) {
    if (!visor || typeof visor.showModal !== "function") return;
    visorItem = item;
    visorIdx = 0;
    pintarVisor();
    visor.showModal();
  }

  if (visor) {
    document.getElementById("visor-cerrar").addEventListener("click", function () { visor.close(); });
    document.getElementById("visor-ant").addEventListener("click", function () { moverVisor(-1); });
    document.getElementById("visor-sig").addEventListener("click", function () { moverVisor(1); });

    // Clic fuera del contenido cierra el visor
    visor.addEventListener("click", function (e) {
      if (e.target === visor) visor.close();
    });
    visor.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") moverVisor(-1);
      if (e.key === "ArrowRight") moverVisor(1);
    });
    // Al cerrar, se vacía para detener cualquier video
    visor.addEventListener("close", function () {
      visorMedia.textContent = "";
      visorItem = null;
    });
  }

  /* ---------- Menú en celular ---------- */

  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("menu");

  function cerrarMenu() {
    menu.classList.remove("abierto");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      toggle.setAttribute("aria-expanded", String(abierto));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) cerrarMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarMenu();
    });
  }

  /* ---------- Formulario: abre WhatsApp con el mensaje listo ---------- */

  var formulario = document.getElementById("formulario");
  if (formulario) {
    formulario.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = formulario.elements.nombre.value.trim();
      var negocio = formulario.elements.negocio.value.trim();
      var mensaje = formulario.elements.mensaje.value.trim();
      var error = document.getElementById("formulario-error");

      if (!nombre || !mensaje) {
        error.hidden = false;
        return;
      }
      error.hidden = true;

      var texto = "Hola Juan, soy " + nombre + (negocio ? " de " + negocio : "") + ". " + mensaje;
      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Arranque ---------- */

  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  pintarHero();
  pintarFiltros();
  pintarGaleria();
})();

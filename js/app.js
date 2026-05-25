// ─────────────────────────────────────────
// DATOS — Array de casos
// ─────────────────────────────────────────

let proyectos = [
  {
    id: 1,
    titulo: "Roswell, 1947",
    descripcion: "Objeto no identificado recuperado en el desierto de Nuevo México. Los testigos describen material de construcción desconocido y cuerpos de origen incierto.",
    evidencias: ["Fotografía aérea", "Análisis de terreno", "Testimonio civil"],
    url_imagen: "assets/img/roswell.jpg",
    anio: 1947,
    duracion: 94,
    clasificado: false
  },
  {
    id: 2,
    titulo: "Luces de Phoenix, 1997",
    descripcion: "Miles de testigos reportaron una formación de luces sobre Arizona durante más de dos horas. Ninguna explicación oficial ha sido aceptada universalmente.",
    evidencias: ["Video documental", "Cartografía", "Análisis espectral"],
    url_imagen: "assets/img/phoenix.png",
    anio: 1997,
    duracion: 120,
    clasificado: false
  },
  {
    id: 3,
    titulo: "Área 51",
    descripcion: "Instalación militar de acceso restringido en Nevada. Décadas de actividad aérea no explicada y testimonios de ex empleados clasificados.",
    evidencias: ["Imágenes satelitales", "Documentos desclasificados", "Investigación de campo"],
    url_imagen: "assets/img/area51.jpg",
    anio: 1955,
    duracion: 200,
    clasificado: true
  },
  {
    id: 4,
    titulo: "Rendlesham Forest, 1980",
    descripcion: "Personal militar británico reportó el aterrizaje de una nave triangular en el bosque. Las marcas en el suelo y la radiación residual fueron documentadas.",
    evidencias: ["Análisis de radiación", "Testimonio militar", "Fotografía nocturna"],
    url_imagen: "assets/img/rendlesham.jpg",
    anio: 1980,
    duracion: 75,
    clasificado: false
  },
  {
    id: 5,
    titulo: "Tic Tac, 2004",
    descripcion: "Pilotos de la Marina de EE.UU. interceptaron un objeto de forma ovalada sin alas ni propulsión visible. El video fue desclasificado en 2017.",
    evidencias: ["Video FLIR", "Radar", "Testimonio de pilotos"],
    url_imagen: "assets/img/tictac.png",
    anio: 2004,
    duracion: 88,
    clasificado: false
  },
  {
    id: 6,
    titulo: "UAP ante el Congreso, 2023",
    descripcion: "Primera audiencia oficial del Congreso de EE.UU. sobre fenómenos aéreos no identificados. Ex oficiales militares testificaron bajo juramento.",
    evidencias: ["Documentación oficial", "Testimonio bajo juramento", "Análisis político"],
    url_imagen: "assets/img/congreso.jpg",
    anio: 2023,
    duracion: 180,
    clasificado: false
  }
];

// ─────────────────────────────────────────
// localStorage
// ─────────────────────────────────────────

function guardarEnStorage() {
  localStorage.setItem('xfiles-casos', JSON.stringify(proyectos));
}

function cargarDesdeStorage() {
  const datos = localStorage.getItem('xfiles-casos');
  if (datos) {
    proyectos = JSON.parse(datos);
  }
}

// ─────────────────────────────────────────
// ESTADO
// ─────────────────────────────────────────

let modoAdmin = false;
let proyectoEditandoId = null;


// ─────────────────────────────────────────
// ESTRUCTURAS — Pila y Cola
// ─────────────────────────────────────────

// PILA → historial de casos abiertos
let pilaRecientes = [];

// COLA → eventos del sistema
let colaEventos = [];

// ─────────────────────────────────────────
// RENDER — Dibuja las cards en el grid
// ─────────────────────────────────────────

function renderGrid() {
  const grid = document.getElementById('grid');
  if (!grid) return;

  grid.innerHTML = '';

  proyectos.forEach(caso => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = caso.id;

    card.innerHTML = `
      <img class="card__img" src="${caso.url_imagen}" alt="${caso.titulo}">
      <div class="card__info">
        <h3 class="card__titulo">${caso.titulo}</h3>
        <p class="card__meta">${caso.anio} · ${caso.clasificado ? 'Clasificado' : 'Desclasificado'}</p>
      </div>
      <div class="card__admin">
        <button class="btn-editar" title="Editar">✎</button>
        <button class="btn-eliminar" title="Eliminar">✕</button>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.card__admin')) return;
      abrirModalDetalle(caso.id);
    });

    card.querySelector('.btn-editar').addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModalAdmin(caso.id);
    });

    card.querySelector('.btn-eliminar').addEventListener('click', (e) => {
      e.stopPropagation();
      eliminarProyecto(caso.id);
    });

    grid.appendChild(card);
  });
}

// ─────────────────────────────────────────
// MODAL DETALLE
// ─────────────────────────────────────────

function abrirModalDetalle(id) {
  const caso = proyectos.find(p => p.id === id);
  if (!caso) return;

  document.getElementById('modalImg').src = caso.url_imagen;
  document.getElementById('modalImg').alt = caso.titulo;
  document.getElementById('modalTitulo').textContent = caso.titulo;
  document.getElementById('modalMeta').textContent =
    `${caso.anio} · ${caso.duracion} min · ${caso.clasificado ? 'Clasificado' : 'Desclasificado'}`;
  document.getElementById('modalDescripcion').textContent = caso.descripcion;
  document.getElementById('modalHabilidades').textContent =
    caso.evidencias.join(' · ');

  document.getElementById('modalOverlay').classList.add('active');

  // PILA → guardar historial de casos abiertos
  pilaRecientes.push(caso.titulo);

  console.log('Pila de recientes:', pilaRecientes);
}

function cerrarModalDetalle() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// ─────────────────────────────────────────
// MODAL ADMIN — Agregar / Editar
// ─────────────────────────────────────────

function abrirModalAdmin(id = null) {
  proyectoEditandoId = id;

  const titulo = document.getElementById('modalAdminTitulo');

  if (id !== null) {
    const caso = proyectos.find(p => p.id === id);
    titulo.textContent = 'Editar caso';
    document.getElementById('inputNombre').value = caso.titulo;
    document.getElementById('inputAnio').value = caso.anio;
    document.getElementById('inputTipo').value = caso.clasificado ? 'Clasificado' : 'Desclasificado';
    document.getElementById('inputDescripcion').value = caso.descripcion;
    document.getElementById('inputImagen').value = caso.url_imagen;
    document.getElementById('inputHabilidades').value = caso.evidencias.join(', ');
    document.getElementById('inputPersonal').value = String(!caso.clasificado);
    document.getElementById('inputAltura').value = caso.duracion;
  } else {
    titulo.textContent = 'Nuevo caso';
    document.getElementById('inputNombre').value = '';
    document.getElementById('inputAnio').value = '';
    document.getElementById('inputTipo').value = '';
    document.getElementById('inputDescripcion').value = '';
    document.getElementById('inputImagen').value = '';
    document.getElementById('inputHabilidades').value = '';
    document.getElementById('inputPersonal').value = 'false';
    document.getElementById('inputAltura').value = '';
  }

  document.getElementById('modalAdminOverlay').classList.add('active');
}

function cerrarModalAdmin() {
  document.getElementById('modalAdminOverlay').classList.remove('active');
  proyectoEditandoId = null;
}

// ─────────────────────────────────────────
// GUARDAR — Agregar o actualizar caso
// ─────────────────────────────────────────

function guardarProyecto() {
  const nombre = document.getElementById('inputNombre').value.trim();
  const anio = parseInt(document.getElementById('inputAnio').value);
  const descripcion = document.getElementById('inputDescripcion').value.trim();
  const imagen = document.getElementById('inputImagen').value.trim();
  const evidencias = document.getElementById('inputHabilidades').value
    .split(',').map(h => h.trim()).filter(h => h !== '');
  const esClasificado = document.getElementById('inputPersonal').value === 'false';
  const duracion = parseInt(document.getElementById('inputAltura').value) || 0;

  if (!nombre || !anio || !imagen) {
    alert('Título, año e imagen son obligatorios.');
    return;
  }

  if (proyectoEditandoId !== null) {
    const index = proyectos.findIndex(p => p.id === proyectoEditandoId);
    proyectos[index] = {
      ...proyectos[index],
      titulo: nombre,
      anio: anio,
      descripcion: descripcion,
      url_imagen: imagen,
      evidencias: evidencias,
      duracion: duracion,
      clasificado: esClasificado
    };
  } else {
    const nuevoId = proyectos.length > 0
      ? Math.max(...proyectos.map(p => p.id)) + 1
      : 1;

    proyectos.push({
      id: nuevoId,
      titulo: nombre,
      descripcion: descripcion,
      evidencias: evidencias,
      url_imagen: imagen,
      anio: anio,
      duracion: duracion,
      clasificado: esClasificado
    });
  }

  // COLA → registrar evento
  colaEventos.push('Caso agregado o editado');

  console.log('Procesando cola:', colaEventos.shift());

  cerrarModalAdmin();
  guardarEnStorage();
  renderGrid();
}

// ─────────────────────────────────────────
// ELIMINAR caso
// ─────────────────────────────────────────

function eliminarProyecto(id) {
  const caso = proyectos.find(p => p.id === id);
  if (!caso) return;

  if (confirm(`¿Eliminar "${caso.titulo}"?`)) {
        // COLA → registrar eliminación
    colaEventos.push(`Caso eliminado: ${caso.titulo}`);
    console.log('Procesando cola:', colaEventos.shift());
    proyectos = proyectos.filter(p => p.id !== id);
    guardarEnStorage();
    renderGrid();
  }
}

// ─────────────────────────────────────────
// ORDENAR
// ─────────────────────────────────────────

let ordenNombreAsc = true;
let ordenAnioAsc = true;

function ordenarPorNombre() {
  proyectos.sort((a, b) => {
    const comparacion = a.titulo.localeCompare(b.titulo);
    return ordenNombreAsc ? comparacion : -comparacion;
  });
  ordenNombreAsc = !ordenNombreAsc;
  document.getElementById('btnOrdenarNombre').textContent =
    ordenNombreAsc ? 'Título ↑' : 'Título ↓';
  renderGrid();
}

function ordenarPorAnio() {
  proyectos.sort((a, b) => {
    return ordenAnioAsc ? a.anio - b.anio : b.anio - a.anio;
  });
  ordenAnioAsc = !ordenAnioAsc;
  document.getElementById('btnOrdenarAnio').textContent =
    ordenAnioAsc ? 'Año ↑' : 'Año ↓';
  renderGrid();
}

// ─────────────────────────────────────────
// MODO ADMIN — activar con Ctrl+A
// ─────────────────────────────────────────

function toggleAdmin() {
  if (modoAdmin) {
    modoAdmin = false;
    document.body.classList.remove('admin-mode');
  } else {
    const clave = prompt('Contraseña:');
    if (clave === '1234') {
      modoAdmin = true;
      document.body.classList.add('admin-mode');
    } else if (clave !== null) {
      alert('Contraseña incorrecta.');
    }
  }
}

// ─────────────────────────────────────────
// HAMBURGER — menú mobile
// ─────────────────────────────────────────

function initHamburger() {
  const btn = document.getElementById('btnHamburger');
  const menu = document.getElementById('menuMobile');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

// ─────────────────────────────────────────
// EVENTOS — inicialización
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  cargarDesdeStorage();
  renderGrid();

  initHamburger();

  const modalCerrar = document.getElementById('modalCerrar');
  if (modalCerrar) modalCerrar.addEventListener('click', cerrarModalDetalle);

  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) cerrarModalDetalle();
    });
  }

  const modalAdminCerrar = document.getElementById('modalAdminCerrar');
  if (modalAdminCerrar) modalAdminCerrar.addEventListener('click', cerrarModalAdmin);

  const modalAdminOverlay = document.getElementById('modalAdminOverlay');
  if (modalAdminOverlay) {
    modalAdminOverlay.addEventListener('click', (e) => {
      if (e.target === modalAdminOverlay) cerrarModalAdmin();
    });
  }

  const btnAgregar = document.getElementById('btnAgregar');
  if (btnAgregar) btnAgregar.addEventListener('click', () => abrirModalAdmin());

  const btnGuardar = document.getElementById('btnGuardar');
  if (btnGuardar) btnGuardar.addEventListener('click', guardarProyecto);

  const btnNombre = document.getElementById('btnOrdenarNombre');
  if (btnNombre) btnNombre.addEventListener('click', ordenarPorNombre);

  const btnAnio = document.getElementById('btnOrdenarAnio');
  if (btnAnio) btnAnio.addEventListener('click', ordenarPorAnio);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'a' && e.ctrlKey) {
      e.preventDefault();
      toggleAdmin();
    }
  });

});
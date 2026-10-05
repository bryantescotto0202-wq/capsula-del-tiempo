// CONFIGURACIÓN DE HORA Y RESPUESTAS
// Configurado para abrirse a las 10:19 PM del 4 de Octubre de 2026
const fechaObjetivo = new Date("October 4, 2026 22:42:00").getTime();
const CONTRASEÑA_CORRECTA = "P28!";
const CARACTERES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

// CARGA DE AUDIOS REALES
const audioXP = new Audio('xp.mp3');
const audioClick = new Audio('click.mp3');
const audioNether = new Audio('nether.mp3');
const audioWrong = new Audio('wrong.mp3');

// ARIA MATH
const musicaAriaMath = new Audio('aria_math.mp3');
musicaAriaMath.loop = true;
musicaAriaMath.volume = 0;

const LISTA_LOGROS_DEFINICION = [
  { id: "¡Código Descifrado!", desc: "Espera a que el temporizador llegue a cero para revelar el código.", icono: "🔑" },
  { id: "¡Cápsula Desbloqueada!", desc: "Ingresa la contraseña correcta y abre el cofre del tiempo.", icono: "🏆" },
  { id: "Explorador del Pasado", desc: "Haz clic en el botón de la BlackBerry para descubrir su historia.", icono: "📱" },
  { id: "Tecnología del Presente", desc: "Haz clic en el botón de la Smartphone para aprender sobre su tecnología.", icono: "🤖" }
];

const elDias = document.getElementById("dias");
const elHoras = document.getElementById("horas");
const elMinutos = document.getElementById("minutos");
const elSegundos = document.getElementById("segundos");
const btnDesbloquear = document.getElementById("btn-desbloquear");
const pantallaCaracteres = document.getElementById("pantalla-caracteres");
const mensajeError = document.getElementById("mensaje-error");
const inputClave = document.getElementById("input-clave");

let temporizadorError = null;
let temporizadorRuleta = null;
let codigoRevelado = false;
let musicaActiva = true;

// CONTROL INTELIGENTE DE CLIC VS ARRASTRE PARA MODELOS 3D
let posInicioX = 0;
let posInicioY = 0;

function registrarInicioClic(e) {
  const touch = e.touches ? e.touches[0] : e;
  posInicioX = touch.clientX;
  posInicioY = touch.clientY;
}

function procesarFinClic(e, tipo) {
  const touch = e.changedTouches ? e.changedTouches[0] : e;
  const distX = Math.abs(touch.clientX - posInicioX);
  const distY = Math.abs(touch.clientY - posInicioY);

  if (distX < 8 && distY < 8) {
    mostrarInfo(tipo);
  }
}

// Cargar logros guardados
const guardados = JSON.parse(localStorage.getItem("mc_logros_capsula") || "[]");
const logrosObtenidos = new Set(guardados);
const colaLogros = [];
let mostrandoLogro = false;
let orbesXP = [];

// FUNCIÓN PARA BORRAR LA DATA DE LOS LOGROS Y REINICIAR TODO
function reiniciarProgreso() {
  localStorage.removeItem("mc_logros_capsula");
  logrosObtenidos.clear();
  actualizarContadorLogrosUI();
  enviarMensajeChat("[Servidor] Datos y logros reiniciados por completo.", "#ff5555");
}

if (inputClave) {
  inputClave.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
    reproducirSonidoEfecto(audioClick, 1.0);
  });

  inputClave.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      validarClave();
    }
  });
}

// BAZINGA EASTER EGG
let bufferTeclas = "";
const CLAVE_SECRETA = "bazinga";

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;

  bufferTeclas += e.key.toLowerCase();
  
  if (bufferTeclas.length > CLAVE_SECRETA.length) {
    bufferTeclas = bufferTeclas.slice(-CLAVE_SECRETA.length);
  }

  if (bufferTeclas === CLAVE_SECRETA) {
    bufferTeclas = "";
    activarModoDevBazinga();
  }
});

function activarModoDevBazinga() {
  reproducirSonidoEfecto(audioXP);
  enviarMensajeChat("[Servidor] ¡MODO BAZINGA ACTIVADO!", "#ffff55");
  
  if (!codigoRevelado) {
    detenerYRevelarCodigo();
  } else {
    if (inputClave) inputClave.value = CONTRASEÑA_CORRECTA;
    validarClave();
  }
}

function iniciarExperienciaConAudio() {
  document.getElementById("pantalla-inicio-audio").classList.add("oculto");
  
  if (musicaActiva) {
    musicaAriaMath.currentTime = 160;
    musicaAriaMath.play().then(() => {
      aplicarFadeInMusica(0.15, 4000);
    }).catch(() => {});
  }
  
  reproducirSonidoEfecto(audioClick, 1.0);
  enviarMensajeChat("[Servidor] Cápsula del tiempo sincronizada.", "#55ff55");
}

function aplicarFadeInMusica(volumenObjetivo, duracionMs) {
  let paso = 0.01;
  let intervaloTiempo = duracionMs / (volumenObjetivo / paso);
  
  let intervaloFade = setInterval(() => {
    if (musicaAriaMath.volume + paso < volumenObjetivo) {
      musicaAriaMath.volume += paso;
    } else {
      musicaAriaMath.volume = volumenObjetivo;
      clearInterval(intervaloFade);
    }
  }, intervaloTiempo);
}

musicaAriaMath.addEventListener('ended', () => {
  musicaAriaMath.currentTime = 160;
  musicaAriaMath.play();
});

function reproducirSonidoEfecto(audioObj, volumen = 1.0) {
  try {
    const sonidoClon = audioObj.cloneNode();
    sonidoClon.volume = volumen;
    sonidoClon.play().catch(() => {});
  } catch (e) {}
}

function actualizarContadorLogrosUI() {
  const contador = document.getElementById("contador-logros");
  if (contador) {
    contador.innerText = logrosObtenidos.size;
  }
}

function enviarMensajeChat(mensaje, color = "#aaaaaa") {
  const contenedorChat = document.getElementById("chat-minecraft");
  if (!contenedorChat) return;
  const elementoChat = document.createElement("div");
  elementoChat.className = "linea-chat";
  if (color !== "#aaaaaa") elementoChat.style.borderLeftColor = color;
  elementoChat.innerText = mensaje;

  contenedorChat.appendChild(elementoChat);

  setTimeout(() => {
    elementoChat.style.opacity = "0";
    elementoChat.style.transition = "opacity 0.5s ease";
    setTimeout(() => elementoChat.remove(), 500);
  }, 5000);
}

function reproducirClicMC() { reproducirSonidoEfecto(audioClick, 1.0); }

function lanzarLogro(titulo) {
  if (logrosObtenidos.has(titulo)) return;
  logrosObtenidos.add(titulo);

  localStorage.setItem("mc_logros_capsula", JSON.stringify(Array.from(logrosObtenidos)));
  actualizarContadorLogrosUI();

  colaLogros.push(titulo);
  enviarMensajeChat(`[Logro] ¡Desafío completado: ${titulo}!`, "#ffaa00");
  generarExplosionXP();

  if (!mostrandoLogro) {
    procesarColaLogros();
  }
}

function procesarColaLogros() {
  if (colaLogros.length === 0) {
    mostrandoLogro = false;
    return;
  }

  mostrandoLogro = true;
  const tituloActual = colaLogros.shift();

  reproducirSonidoEfecto(audioXP);
  const elNotif = document.getElementById("notificacion-logro");
  const elTitulo = document.getElementById("logro-titulo");

  if (elNotif && elTitulo) {
    elTitulo.innerText = tituloActual;

    elNotif.classList.remove("oculto");
    elNotif.classList.remove("animar-logro");
    void elNotif.offsetWidth;
    elNotif.classList.add("animar-logro");

    setTimeout(() => {
      elNotif.classList.add("oculto");
      mostrandoLogro = false;
      procesarColaLogros();
    }, 4000);
  } else {
    mostrandoLogro = false;
  }
}

function abrirLibroLogros() {
  reproducirClicMC();
  const contenedor = document.getElementById("lista-logros-inventario");
  if (!contenedor) return;
  
  contenedor.innerHTML = "";
  LISTA_LOGROS_DEFINICION.forEach(logro => {
    const esCompletado = logrosObtenidos.has(logro.id);
    const div = document.createElement("div");
    div.className = `tarjeta-logro-inv ${esCompletado ? 'completado' : ''}`;
    div.innerHTML = `
      <div class="icon-status">${esCompletado ? logro.icono : '🔒'}</div>
      <div>
        <div class="titulo-logro-inv">${logro.id}</div>
        <div class="desc-logro-inv">${logro.desc}</div>
      </div>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("modal-logros").classList.remove("oculto");
}

function cerrarLibroLogros() {
  reproducirClicMC();
  document.getElementById("modal-logros").classList.add("oculto");
}

function toggleMusica() {
  const btn = document.getElementById("btn-musica");
  
  if (!musicaActiva) {
    musicaActiva = true;
    if (btn) btn.innerText = "🎵 Música: ON";
    if (musicaAriaMath.currentTime === 0) musicaAriaMath.currentTime = 160;
    musicaAriaMath.play().catch(() => {});
    enviarMensajeChat("[Audio] Música activada.", "#55ffff");
  } else {
    musicaActiva = false;
    if (btn) btn.innerText = "🎵 Música: OFF";
    musicaAriaMath.pause();
    enviarMensajeChat("[Audio] Música pausada.", "#ff5555");
  }
}

function togglePantallaCompleta() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    enviarMensajeChat("[Sistema] Modo Exposición Activado.");
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function generarExplosionXP() {
  const canvas = document.getElementById("canvas-particulas");
  if (!canvas) return;
  const centroX = window.innerWidth / 2;
  const centroY = window.innerHeight / 2;

  for (let i = 0; i < 35; i++) {
    const angulo = Math.random() * Math.PI * 2;
    const velocidad = Math.random() * 6 + 2;
    orbesXP.push({
      x: centroX,
      y: centroY,
      vx: Math.cos(angulo) * velocidad,
      vy: Math.sin(angulo) * velocidad - 2,
      tamano: Math.random() * 5 + 3,
      vida: 1.0,
      color: Math.random() > 0.5 ? "#55ff55" : "#ffff55"
    });
  }
}

function iniciarParticulasNether() {
  const canvas = document.getElementById("canvas-particulas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function redimensionar() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", redimensionar);
  redimensionar();

  const particulas = [];
  for (let i = 0; i < 40; i++) {
    particulas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tamano: Math.random() * 3 + 2,
      velocidadY: Math.random() * 0.7 + 0.3,
      velocidadX: (Math.random() - 0.5) * 0.3,
      opacidad: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? "#aa00aa" : "#55ff55"
    });
  }

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particulas.forEach(p => {
      p.y -= p.velocidadY;
      p.x += p.velocidadX;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacidad;
      ctx.fillRect(p.x, p.y, p.tamano, p.tamano);
    });

    for (let i = orbesXP.length - 1; i >= 0; i--) {
      const o = orbesXP[i];
      o.x += o.vx;
      o.y += o.vy;
      o.vy += 0.15;
      o.vida -= 0.02;

      if (o.vida <= 0) {
        orbesXP.splice(i, 1);
      } else {
        ctx.fillStyle = o.color;
        ctx.globalAlpha = o.vida;
        ctx.fillRect(o.x, o.y, o.tamano, o.tamano);
      }
    }

    requestAnimationFrame(animar);
  }
  animar();
}

iniciarParticulasNether();

function iniciarRuletaCaracteres() {
  temporizadorRuleta = setInterval(() => {
    let randStr = "";
    for (let i = 0; i < 4; i++) {
      randStr += CARACTERES.charAt(Math.floor(Math.random() * CARACTERES.length));
    }
    pantallaCaracteres.innerText = randStr;
  }, 60);
}

iniciarRuletaCaracteres();

const cuentaRegresiva = setInterval(() => {
  const ahora = new Date().getTime();
  const diferencia = fechaObjetivo - ahora;

  if (diferencia <= 0) {
    clearInterval(cuentaRegresiva);
    elDias.innerText = "00";
    elHoras.innerText = "00";
    elMinutos.innerText = "00";
    elSegundos.innerText = "00";

    if (!codigoRevelado) {
      detenerYRevelarCodigo();
    }
  } else {
    const d = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const h = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diferencia % (1000 * 60)) / 1000);

    elDias.innerText = d < 10 ? '0' + d : d;
    elHoras.innerText = h < 10 ? '0' + h : h;
    elMinutos.innerText = m < 10 ? '0' + m : m;
    elSegundos.innerText = s < 10 ? '0' + s : s;
  }
}, 1000);

function detenerYRevelarCodigo() {
  codigoRevelado = true;
  clearInterval(temporizadorRuleta);
  
  let resultadoActual = ["?", "?", "?", "?"];
  const claveOriginal = CONTRASEÑA_CORRECTA.split("");
  
  claveOriginal.forEach((char, index) => {
    setTimeout(() => {
      resultadoActual[index] = char;
      for (let j = index + 1; j < 4; j++) {
        resultadoActual[j] = CARACTERES.charAt(Math.floor(Math.random() * CARACTERES.length));
      }
      pantallaCaracteres.innerText = resultadoActual.join("");
      reproducirSonidoEfecto(audioClick, 1.0);
      
      if (index === 3) {
        lanzarLogro("¡Código Descifrado!");
        btnDesbloquear.disabled = false;
        btnDesbloquear.style.backgroundColor = "#1f4a1f";
        btnDesbloquear.style.borderColor = "#55ff55";
        btnDesbloquear.style.color = "#55ff55";
      }
    }, (index + 1) * 550);
  });
}

function validarClave() {
  reproducirClicMC();
  const claveIngresada = inputClave ? inputClave.value.trim().toUpperCase() : CONTRASEÑA_CORRECTA;

  if (claveIngresada === CONTRASEÑA_CORRECTA.toUpperCase()) {
    // Reproduce el sonido de Nether
    reproducirSonidoEfecto(audioNether, 0.35);

    // Obtiene la duración del audio de nether (si falla, usa 3 segundos por defecto)
    const duracionAudioMs = (audioNether.duration && !isNaN(audioNether.duration)) 
      ? audioNether.duration * 1000 
      : 3000;

    const tiempoMitad = duracionAudioMs / 2; // Momento exacto de blanco total
    const transicion = document.getElementById("transicion-blanca");

    // Ajusta la velocidad del CSS para que coincida exactamente con la primera mitad del audio
    transicion.style.transition = `opacity ${tiempoMitad / 1000}s ease-in-out`;
    transicion.classList.remove("oculto");

    // 1. Inicia el desvanecimiento a blanco total
    requestAnimationFrame(() => {
      transicion.classList.add("flash-activo");
    });

    // 2. CAMBIO INVISIBLE DE PANTALLA: Se ejecuta exactamente a la mitad, cuando todo está 100% blanco
    setTimeout(() => {
      document.getElementById("pantalla-bloqueo").classList.add("oculto");
      document.getElementById("pantalla-proyecto").classList.remove("oculto");
      lanzarLogro("¡Cápsula Desbloqueada!");
    }, tiempoMitad);

    // 3. Quita la pantalla blanca progresivamente en la segunda mitad del audio
    setTimeout(() => {
      transicion.classList.remove("flash-activo");
      setTimeout(() => {
        transicion.classList.add("oculto");
        transicion.style.transition = ""; // Restablece
      }, tiempoMitad);
    }, tiempoMitad);

  } else {
    // Sonido wrong rebajado a 0.4 de volumen
    reproducirSonidoEfecto(audioWrong, 0.4);
    mensajeError.innerText = "¡CLAVE INCORRECTA!";
    if (inputClave) inputClave.value = "";

    clearTimeout(temporizadorError);
    temporizadorError = setTimeout(() => {
      mensajeError.innerText = "";
    }, 3000);
  }
}

function mostrarInfo(tipo) {
  reproducirSonidoEfecto(audioClick, 1.0);
  const modal = document.getElementById("modal-info");
  const titulo = document.getElementById("modal-titulo");
  const texto = document.getElementById("modal-texto");

  if (tipo === 'blackberry') {
    titulo.innerText = "BlackBerry (Pasado)";
    texto.innerText = "Revolucionó el mundo con su teclado físico QWERTY. Era el teléfono favorito antes de las pantallas táctiles modernas.";
    lanzarLogro("Explorador del Pasado");
  } else if (tipo === 'smartphone') {
    titulo.innerText = "Smartphone Moderno";
    texto.innerText = "Sustituyó teclados físicos por pantallas AMOLED táctiles. Hoy en día tiene miles de veces más potencia que las computadoras del siglo pasado.";
    lanzarLogro("Tecnología del Presente");
  }
  modal.classList.remove("oculto");
}

function cerrarInfo() {
  reproducirClicMC();
  document.getElementById("modal-info").classList.add("oculto");
}

// INICIALIZACIÓN Y EVENTOS DE TOOLTIP MINECRAFT
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorLogrosUI();

  const tooltip = document.getElementById('tooltip-mc');
  const tooltipTitulo = document.getElementById('tooltip-titulo');
  const tooltipSubtitulo = document.getElementById('tooltip-subtitulo');

  document.querySelectorAll('[data-nombre]').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      const nombre = elem.getAttribute('data-nombre');
      const subtitulo = elem.getAttribute('data-subtitulo') || '';

      tooltipTitulo.textContent = nombre;
      tooltipSubtitulo.textContent = subtitulo;
      tooltipSubtitulo.style.display = subtitulo ? 'block' : 'none';

      tooltip.style.display = 'block';
    });

    elem.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.pageX + 14) + 'px';
      tooltip.style.top = (e.pageY + 14) + 'px';
    });

    elem.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
});
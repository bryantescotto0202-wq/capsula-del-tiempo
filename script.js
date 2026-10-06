// CONFIGURACIÓN DEL SIMULACRO
const fechaObjetivo = new Date("September 27, 2027 12:00:00").getTime();
const claveReal = "P28!";
const caracteresEspeciales = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

// DOM
const decryptText = document.getElementById("decryptText");
const progressBar = document.getElementById("progressBar");
const percentText = document.getElementById("percentText");
const timerDisplay = document.getElementById("timerDisplay");
const audioToggle = document.getElementById("audioToggle");
const passInput = document.getElementById("passInput");
const submitBtn = document.getElementById("submitBtn");
const consoleStatus = document.getElementById("consoleStatus");
const powerOverlay = document.getElementById("powerOverlay");
const powerBtn = document.getElementById("powerBtn");
const bootScreen = document.getElementById("bootScreen");
const bootText = document.getElementById("bootText");
const mainTerminal = document.getElementById("mainTerminal");
const modelsOverlay = document.getElementById("modelsOverlay");
const crtOverlay = document.getElementById("crtOverlay");
const matrixOverlay = document.getElementById("matrixOverlay");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const reopenTimelineBtn = document.getElementById("reopenTimelineBtn");
const consoleSection = document.getElementById("consoleSection");
const unlockedPanel = document.getElementById("unlockedPanel");
const sysStatusLabel = document.getElementById("sysStatusLabel");
const mainTitle = document.getElementById("mainTitle");
const subHeader = document.getElementById("subHeader");
const powerOffScreen = document.getElementById("powerOffScreen");
const appContainer = document.getElementById("appContainer");

// Modal
const infoModal = document.getElementById("infoModal");
const infoHeaderTag = document.getElementById("infoHeaderTag");
const infoTitle = document.getElementById("infoTitle");
const infoLabel1 = document.getElementById("infoLabel1");
const infoWhyUse = document.getElementById("infoWhyUse");
const infoLabel2 = document.getElementById("infoLabel2");
const infoWhyChange = document.getElementById("infoWhyChange");
const closeInfo = document.getElementById("closeInfo");

const datosModelos = {
  blackberry: {
    tag: "[ REGISTRO CÁPSULA // ERA PASADO: 2000s ]",
    titulo: "NUCLEO: ERA TECLADO QWERTY & BBM",
    label1: "► ¿CÓMO SE USABA Y QUÉ TECNOLOGÍA SUSTITUYÓ?",
    porqueUso: "Reemplazó a las cabinas públicas, pagers y teclados numéricos T9. Permitió redactar correos completos y mensajes instantáneos encriptados (BBM) fuera de la oficina.",
    label2: "► MOTIVACIÓN DE LA EVOLUCIÓN TECNOLÓGICA:",
    porqueChange: "El teclado físico ocupaba el 50% de la pantalla. Al surgir el consumo de video y tiendas de apps, la sociedad demandó pantallas completas y dinámicas."
  },
  smartphone: {
    tag: "[ REGISTRO CÁPSULA // ERA FUTURO: AHORA ]",
    titulo: "NUCLEO: ERA CRISTAL CAPACITIVO & IA",
    label1: "► ¿CÓMO SE USA Y QUÉ TECNOLOGÍA SUSTITUYÓ?",
    porqueUso: "Sustituyó a los teclados físicos, cámaras compactas, GPS independientes y reproductores MP3 en un solo cristal multitáctil.",
    label2: "► MOTIVACIÓN DE LA EVOLUCIÓN TECNOLÓGICA:",
    porqueChange: "Impulsado por la necesidad de procesamiento multimedia e inteligencia artificial autónoma en la palma de la mano."
  }
};

let audioActivado = true;
let bootFinalizado = false; // CONTROL DE ESPERA PARA EL REVELADO

// AUDIOS
const audios = {
  tvOn: new Audio("crt_tv_on.mp3"),
  tvOff: new Audio("crt_tv_off.mp3"),
  estatica: new Audio("estatica.mp3"),
  musica: new Audio("musica.mp3"),
  typing: new Audio("typing.mp3"),
  tick: new Audio("tick.mp3"),
  revealChar: new Audio("reveal_char.mp3"),
  modelClick: new Audio("model_click.mp3"),
  granted: new Audio("granted.mp3"),
  wrong: new Audio("wrong.mp3"),
  glitch: new Audio("glitch.mp3"),
  dudin: new Audio("dudin.mp3") // <-- NUEVO AUDIO 8-BIT
};

audios.dudin.volume = 0.50;

audios.estatica.loop = true; audios.estatica.volume = 0.08;
audios.musica.loop = true; audios.musica.volume = 0.22;
audios.typing.volume = 0.45; audios.tick.volume = 0.20;
audios.revealChar.volume = 0.35; audios.modelClick.volume = 0.40;
audios.wrong.volume = 0.40; audios.granted.volume = 0.50; audios.glitch.volume = 0.55;

audios.tvOn.load(); audios.tvOff.load(); audios.revealChar.load(); audios.modelClick.load();

let intervalVolumen = null;
function cambiarVolumenSuave(audioObj, volumenObjetivo, duracionMs = 500) {
  if (intervalVolumen) clearInterval(intervalVolumen);
  const pasos = 20;
  const pasoTiempo = duracionMs / pasos;
  const diferencia = volumenObjetivo - audioObj.volume;
  const incremento = diferencia / pasos;
  let contador = 0;
  intervalVolumen = setInterval(() => {
    contador++;
    let nuevoVol = audioObj.volume + incremento;
    if (nuevoVol > 1) nuevoVol = 1;
    if (nuevoVol < 0) nuevoVol = 0;
    audioObj.volume = nuevoVol;
    if (contador >= pasos) {
      audioObj.volume = volumenObjetivo;
      clearInterval(intervalVolumen);
    }
  }, pasoTiempo);
}

const lineasBoot = [
  "FPS-3000 CORE OS // VER 3.08 INITIALIZING...",
  "CHECKING RAM MEMORY... [OK]",
  "LOADING 3D GLTF ENGINE... [OK]",
  "ESTABLISHING TEMPORAL LINK WITH TIME CAPSULE...",
  "SYSTEM DECRYPTION READY."
];

let lineaActual = 0;
function animacionBoot() {
  if (lineaActual < lineasBoot.length) {
    bootText.innerText += lineasBoot[lineaActual] + "\n";
    if (audioActivado) {
      audios.typing.currentTime = 0;
      audios.typing.play().catch(() => {});
    }
    lineaActual++;
    setTimeout(animacionBoot, 220);
  } else {
    setTimeout(() => {
      mainTerminal.classList.remove("hidden");
      bootScreen.classList.add("fade-out");
      setTimeout(() => { 
        mainTerminal.classList.add("visible"); 
        // Marcamos que el boot terminó y damos 1.5s de pausa cinemática antes del descifrado
        setTimeout(() => { bootFinalizado = true; }, 1500);
      }, 50);
      setTimeout(() => { bootScreen.classList.add("hidden"); }, 800);
    }, 400);
  }
}

powerBtn.addEventListener("click", () => {
  powerOverlay.classList.add("hidden");
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  requestAnimationFrame(() => {
    crtOverlay.classList.add("active");
    setTimeout(() => {
      if (audioActivado) {
        audios.tvOn.currentTime = 0;
        audios.tvOn.play().catch(() => {});
      }
    }, 320);
    setTimeout(() => {
      crtOverlay.classList.remove("active");
      bootScreen.classList.remove("hidden");
      if (audioActivado) {
        audios.estatica.play().catch(() => {});
        audios.musica.play().catch(() => {});
      }
      animacionBoot();
    }, 650);
  });
});

passInput.addEventListener("input", () => {
  if (audioActivado) {
    audios.typing.currentTime = 0;
    audios.typing.play().catch(() => {});
  }
});

// REVELACIÓN SECUENCIAL Y LLAMATIVA
let revelandoFinal = false;
let caracteresReveladosFinales = 0;

function generarTextoAleatorio(longitud) {
  let res = "";
  for (let i = 0; i < longitud; i++) {
    res += caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length));
  }
  return res;
}

function iniciarReveladoSecuencial() {
  if (revelandoFinal) return;
  revelandoFinal = true;
  caracteresReveladosFinales = 0;

  const intervalRevelado = setInterval(() => {
    caracteresReveladosFinales++;
    
    if (audioActivado) {
      audios.revealChar.currentTime = 0;
      audios.revealChar.play().catch(() => {});
    }

    if (caracteresReveladosFinales >= claveReal.length) {
      clearInterval(intervalRevelado);
      decryptText.innerText = `CLAVE: ${claveReal}`;
      // Animación brillante al completar el desbloqueo
      decryptText.classList.add("key-unlocked-glow");
    }
  }, 350);
}

function obtenerTextoMatrizORevelado() {
  if (caracteresReveladosFinales >= claveReal.length) {
    return claveReal;
  }
  let resultado = claveReal.substring(0, caracteresReveladosFinales);
  resultado += generarTextoAleatorio(claveReal.length - caracteresReveladosFinales);
  return resultado;
}

// MATRIX OVERLAY
let matrixInterval;
function iniciarEfectoMatrix() {
  matrixOverlay.classList.remove("hidden");
  matrixInterval = setInterval(() => {
    let randStr = ">> DECRYPTING: ";
    for (let i = 0; i < 24; i++) {
      randStr += caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length));
    }
    matrixOverlay.innerText = randStr;
  }, 50);
}

function detenerEfectoMatrix() {
  clearInterval(matrixInterval);
  matrixOverlay.classList.add("hidden");
}

let intentosFallidos = 0;

function abrirTimeline() {
  if (audioActivado) { cambiarVolumenSuave(audios.musica, 0.05, 600); }
  iniciarEfectoMatrix();

  setTimeout(() => {
    detenerEfectoMatrix();
    modelsOverlay.classList.remove("hidden");
    requestAnimationFrame(() => {
      modelsOverlay.classList.add("active");
      checkScrollReveal();
    });
  }, 650);
}

function verificarClave() {
  const password = passInput.value.trim().toUpperCase();

  if (password === "P28!") {
    // Si la fecha objetivo AÚN NO se ha cumplido y NO están en Modo Demo
    const ahora = new Date().getTime();
    const tiempoRestante = fechaObjetivo - ahora;

    if (tiempoRestante > 0 && !modoDemoActivo) {
      // TROLLEO A LOS COMPAÑEROS QUE SE SABEN LA CLAVE
      consoleStatus.innerText = ">> SABES EL SECRETO, PERO AÚN NO ES TIEMPO...";
      
      if (audioActivado) {
        audios.wrong.pause();
        audios.glitch.pause();
        audios.dudin.currentTime = 0;
        audios.dudin.play().catch(() => {});
      }

      // Pequeño parpadeo en el panel
      mainTerminal.classList.add("glitch-shake");
      setTimeout(() => { mainTerminal.classList.remove("glitch-shake"); }, 400);
      return;
    }

    // SI YA LLEGÓ A CERO O ESTÁ EN MODO DEMO "bill"
    intentosFallidos = 0;
    consoleStatus.innerText = ">> ACCESO CONCEDIDO: MATERIALIZANDO ARTEFACTOS...";
    
    if (audioActivado) {
      audios.wrong.pause(); audios.glitch.pause();
      audios.granted.currentTime = 0; audios.granted.play().catch(() => {});
    }

    consoleSection.classList.add("hidden");
    unlockedPanel.classList.remove("hidden");
    sysStatusLabel.innerText = "ESTADO: DESBLOQUEADO";
    mainTitle.innerText = "SISTEMA CÁPSULA TEMPORAL";
    subHeader.innerText = "EVOLUCIÓN TECNOLÓGICA REGISTRADA";

    abrirTimeline();

  } else {
    // CLAVE INCORRECTA
    intentosFallidos++;
    if (intentosFallidos >= 3) {
      consoleStatus.innerText = ">> ¡ALERTA DE SEGURIDAD! SOBRECARGA EN EL SISTEMA.";
      if (audioActivado) {
        audios.wrong.pause();
        audios.glitch.currentTime = 0; audios.glitch.play().catch(() => {});
      }
      mainTerminal.classList.add("glitch-shake");
      setTimeout(() => { mainTerminal.classList.remove("glitch-shake"); }, 450);
    } else {
      consoleStatus.innerText = `>> CLAVE INCORRECTA. INTENTO [${intentosFallidos}/3].`;
      if (audioActivado) {
        audios.wrong.currentTime = 0; audios.wrong.play().catch(() => {});
      }
    }
  }
}

submitBtn.addEventListener("click", verificarClave);
passInput.addEventListener("keypress", (e) => { if (e.key === "Enter") verificarClave(); });

backToMenuBtn.addEventListener("click", () => {
  if (audioActivado) {
    audios.tick.currentTime = 0; audios.tick.play().catch(() => {});
    cambiarVolumenSuave(audios.musica, 0.22, 600);
  }
  modelsOverlay.classList.remove("active");
  setTimeout(() => { modelsOverlay.classList.add("hidden"); }, 600);
});

reopenTimelineBtn.addEventListener("click", () => { abrirTimeline(); });

document.querySelectorAll(".global-power-off").forEach(btn => {
  btn.addEventListener("click", ejecutarApagadoSincronizado);
});

function ejecutarApagadoSincronizado() {
  Object.values(audios).forEach(a => a.pause());
  appContainer.classList.add("fade-out-all");
  setTimeout(() => {
    crtOverlay.classList.add("turn-off");
    setTimeout(() => {
      if (audioActivado) {
        audios.tvOff.currentTime = 0;
        audios.tvOff.play().catch(() => {});
      }
    }, 320);
    setTimeout(() => {
      if (document.exitFullscreen) { document.exitFullscreen().catch(() => {}); }
      powerOffScreen.classList.remove("hidden");
    }, 650);
  }, 350);
}

function checkScrollReveal() {
  const reveals = document.querySelectorAll(".scroll-reveal");
  const triggerBottom = window.innerHeight * 0.90;
  reveals.forEach(reveal => {
    const revealTop = reveal.getBoundingClientRect().top;
    if (revealTop < triggerBottom) { reveal.classList.add("visible"); }
  });
}

modelsOverlay.addEventListener("scroll", checkScrollReveal);

function configurarInteraccionClick(elementId, datosClave) {
  const viewer = document.getElementById(elementId);
  let startX = 0; let startY = 0;

  viewer.addEventListener("pointerdown", (e) => {
    startX = e.clientX; startY = e.clientY;
  });

  viewer.addEventListener("pointerup", (e) => {
    const diffX = Math.abs(e.clientX - startX);
    const diffY = Math.abs(e.clientY - startY);
    if (diffX < 6 && diffY < 6) { mostrarDatoCurioso(datosClave); }
  });
}

function mostrarDatoCurioso(datos) {
  infoHeaderTag.innerText = datos.tag;
  infoTitle.innerText = datos.titulo;
  infoLabel1.innerText = datos.label1;
  infoWhyUse.innerText = datos.porqueUso;
  infoLabel2.innerText = datos.label2;
  infoWhyChange.innerText = datos.porqueChange;
  infoModal.classList.remove("hidden");

  if (audioActivado) {
    audios.modelClick.currentTime = 0; audios.modelClick.play().catch(() => {});
  }
}

configurarInteraccionClick("mvBb", datosModelos.blackberry);
configurarInteraccionClick("mvSmart", datosModelos.smartphone);

closeInfo.addEventListener("click", () => { infoModal.classList.add("hidden"); });

audioToggle.addEventListener("click", () => {
  audioActivado = !audioActivado;
  audioToggle.innerText = audioActivado ? "🔊 AUDIO: ON" : "🔇 AUDIO: OFF";
  if (!audioActivado) {
    Object.values(audios).forEach(a => a.pause());
  } else {
    audios.estatica.play().catch(() => {});
    audios.musica.play().catch(() => {});
  }
});

// CONTROL DE CONTADOR Y PROGRESO DE LA BARRA
let modoDemoActivo = false;
let progresoDemo = 0;

function actualizarContador() {
  if (modoDemoActivo) {
    if (progresoDemo < 100) {
      progresoDemo += 4;
      if (progresoDemo > 100) progresoDemo = 100;

      progressBar.style.width = `${progresoDemo}%`;
      percentText.innerText = `PROGRESO DE DESBLOQUEO: ${progresoDemo}%`;
      decryptText.innerText = `CLAVE: ${generarTextoAleatorio(4)}`;
      timerDisplay.innerText = `TIEMPO RESTANTE: 00D 00H 00M 0${Math.max(0, 5 - Math.floor(progresoDemo / 20))}S`;

      if (audioActivado) {
        audios.tick.currentTime = 0; audios.tick.play().catch(() => {});
      }
    } else {
      timerDisplay.innerText = "TIEMPO RESTANTE: 00D 00H 00M 00S";
      iniciarReveladoSecuencial();
      decryptText.innerText = `CLAVE: ${obtenerTextoMatrizORevelado()}`;
    }
    return;
  }

  // TIEMPO REAL
  const ahora = new Date().getTime();
  const diferencia = fechaObjetivo - ahora;

  if (diferencia <= 0) {
    progressBar.style.width = "100%";
    percentText.innerText = "PROGRESO DE DESBLOQUEO: 100%";
    timerDisplay.innerText = "TIEMPO RESTANTE: 00D 00H 00M 00S";
    
    // Solo inicia la secuencia de sonido e interacción una vez que el BOOT ha terminado
    if (bootFinalizado) {
      iniciarReveladoSecuencial();
      decryptText.innerText = `CLAVE: ${obtenerTextoMatrizORevelado()}`;
    } else {
      decryptText.innerText = `CLAVE: ${generarTextoAleatorio(4)}`;
    }
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  timerDisplay.innerText = `TIEMPO RESTANTE: ${dias}D ${horas}H ${minutos}M ${segundos}S`;

  const unAnoEnMs = 365 * 24 * 60 * 60 * 1000;
  const tiempoTranscurrido = unAnoEnMs - (diferencia % unAnoEnMs);
  const progreso = Math.min(99, Math.max(0, Math.floor((tiempoTranscurrido / unAnoEnMs) * 100)));
  
  progressBar.style.width = `${progreso}%`;
  percentText.innerText = `PROGRESO DE DESBLOQUEO: ${progreso}%`;
  decryptText.innerText = `CLAVE: ${generarTextoAleatorio(4)}`;
}

setInterval(actualizarContador, 80);

// DETECTOR DE TECLAS "bill" CON SHAKE EXTRA
let secuenciaTeclas = "";
window.addEventListener("keydown", (e) => {
  secuenciaTeclas += e.key.toLowerCase();
  if (secuenciaTeclas.length > 4) {
    secuenciaTeclas = secuenciaTeclas.slice(-4);
  }

  if (secuenciaTeclas === "bill") {
    activarModoDemo();
    secuenciaTeclas = "";
  }
});

function activarModoDemo() {
  modoDemoActivo = true;
  progresoDemo = 0;

  if (audioActivado) {
    audios.glitch.currentTime = 0;
    audios.glitch.play().catch(() => {});
  }

  // EFECTO DE SHAKE EN PANTALLA COMPLETA
  mainTerminal.classList.add("bill-shake-effect");
  setTimeout(() => {
    mainTerminal.classList.remove("bill-shake-effect");
  }, 600);

  // DESTELLO AMARILLO EN PANTALLA
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = "0";
  flash.style.left = "0";
  flash.style.width = "100vw";
  flash.style.height = "100vh";
  flash.style.backgroundColor = "#ffea00";
  flash.style.opacity = "0.85";
  flash.style.zIndex = "99999";
  flash.style.pointerEvents = "none";
  flash.style.transition = "opacity 0.4s ease-out";

  document.body.appendChild(flash);

  setTimeout(() => {
    flash.style.opacity = "0";
    setTimeout(() => { flash.remove(); }, 400);
  }, 100);
}

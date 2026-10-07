// SIMULATION SETTINGS
const fechaObjetivo = new Date("September 27, 2027 12:00:00").getTime();
const claveReal = "P28!";
const caracteresEspeciales = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

// DOM ELEMENTS
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

// Modal Elements
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
    tag: "[ CAPSULE RECORD // PAST ERA: 2000s ]",
    titulo: "CORE: QWERTY KEYBOARD & BBM ERA",
    label1: "► HOW WAS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced public payphones, pagers, and T9 numeric keypads. Enabled writing full emails and encrypted instant messages (BBM) on the go.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "The physical keyboard took up 50% of the screen. With the rise of video streaming and app stores, society demanded full, dynamic touch displays."
  },
  smartphone: {
    tag: "[ CAPSULE RECORD // FUTURE ERA: NOW ]",
    titulo: "CORE: CAPACITIVE GLASS & AI ERA",
    label1: "► HOW IS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced physical keyboards, compact cameras, standalone GPS units, and MP3 players into a single multi-touch glass surface.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "Driven by the need for high-speed multimedia processing and autonomous artificial intelligence directly in the palm of your hand."
  },
  mouseWired: {
    tag: "[ CAPSULE RECORD // PAST ERA: 1990s-2000s ]",
    titulo: "CORE: WIRED MOUSE & CABLE CONSTRAINT",
    label1: "► HOW WAS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced keyboard command prompts with direct graphic interface (GUI) navigation via physical cord and internal tracking mechanics.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "Cables caused desk clutter and physical movement limits. Users demanded seamless wireless freedom, high-DPI optical precision, and portability."
  },
  mouseWireless: {
    tag: "[ CAPSULE RECORD // FUTURE ERA: NOW ]",
    titulo: "CORE: WIRELESS OPTICAL & ERGONOMIC ERA",
    label1: "► HOW IS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced tethered wired mice using 2.4GHz radio frequency, Bluetooth link, high-precision invisible optical sensors, and lithium batteries.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "Driven by modern remote work setups, mobile laptops, and the necessity for instant multi-device switching without cable drag."
  },
  wiredHeadphones: {
    tag: "[ CAPSULE RECORD // PAST ERA: 2000s ]",
    titulo: "CORE: 3.5mm ANALOG AUDIO JACK ERA",
    label1: "► HOW WAS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced bulky speaker systems for private audio listening using copper wiring and standard 3.5mm analog headphone jacks.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "Wires tangled easily and restricted movement. Smartphone manufacturers removed physical headphone jacks to make devices waterproof and slimmer."
  },
  airpods: {
    tag: "[ CAPSULE RECORD // FUTURE ERA: NOW ]",
    titulo: "CORE: TWS & ACTIVE NOISE CANCELING",
    label1: "► HOW IS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced wired earphones with True Wireless Stereo (TWS), spatial audio algorithms, smart touch gestures, and charging carrying cases.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "Powered by Bluetooth audio codecs, micro-battery density, and AI beamforming microphones for crystal-clear hands-free calls."
  },
  dvd: {
    tag: "[ CAPSULE RECORD // PAST ERA: 2000s ]",
    titulo: "CORE: OPTICAL DISC & DVD-ROM ERA",
    label1: "► HOW WAS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced magnetic VHS tapes and low-capacity Floppy Discs with laser-read optical media storing up to 4.7 GB of video and data.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "Discs were prone to scratches, slow read speeds, and physical loss. Computers abandoned mechanical optical drives to reduce size."
  },
  usbDrive: {
    tag: "[ CAPSULE RECORD // FUTURE ERA: NOW ]",
    titulo: "CORE: FLASH MEMORY & CLOUD SYNC ERA",
    label1: "► HOW IS IT USED & WHAT DID IT REPLACE?",
    porqueUso: "Replaced optical DVDs and CDs with solid-state flash memory, ultra-fast USB-C transfer speeds, and instant internet cloud sync.",
    label2: "► HISTORICAL EVOLUTION DRIVER:",
    porqueChange: "Required for moving massive 4K video files, instant cross-platform compatibility, and wireless cloud accessibility anywhere on Earth."
  }
};

let audioActivado = true;
let bootFinalizado = false;

// AUDIOS (RUTAS A LA CARPETA 'sonido/')
const audios = {
  tvOn: new Audio("sonido/crt_tv_on.mp3"),
  tvOff: new Audio("sonido/crt_tv_off.mp3"),
  estatica: new Audio("sonido/estatica.mp3"),
  musica: new Audio("sonido/musica.mp3"),
  typing: new Audio("sonido/typing.mp3"),
  tick: new Audio("sonido/tick.mp3"),
  revealChar: new Audio("sonido/reveal_char.mp3"),
  modelClick: new Audio("sonido/model_click.mp3"),
  granted: new Audio("sonido/granted.mp3"),
  wrong: new Audio("sonido/wrong.mp3"),
  glitch: new Audio("sonido/glitch.mp3"),
  dudin: new Audio("sonido/dudin.mp3")
};

audios.dudin.volume = 0.50;
audios.estatica.loop = true; audios.estatica.volume = 0.08;
audios.musica.loop = true; audios.musica.volume = 0.22;
audios.typing.volume = 0.45; audios.tick.volume = 0.20;
audios.revealChar.volume = 0.35; audios.modelClick.volume = 0.40;
audios.wrong.volume = 0.40; audios.granted.volume = 0.50; audios.glitch.volume = 0.55;

audios.tvOn.load(); audios.tvOff.load(); audios.revealChar.load(); audios.modelClick.load(); audios.dudin.load();

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
      decryptText.innerText = `PASSCODE: ${claveReal}`;
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

// SECUENCIA CINEMÁTICA DE CARGA MATRIX PARA EVITAR LAG EN 3D
let matrixInterval;
const fasesCarga = [
  ">> INITIALIZING 3D ENGINE PIPELINE...",
  ">> DECOMPRESSING GLTF MESH GEOMETRY...",
  ">> STABILIZING SHADERS & LIGHTING...",
  ">> MATERIALIZING TEMPORAL TIMELINE..."
];

function iniciarEfectoMatrix() {
  matrixOverlay.classList.remove("hidden");
  let contadorFase = 0;
  
  matrixInterval = setInterval(() => {
    let randStr = `${fasesCarga[Math.floor(contadorFase / 15) % fasesCarga.length]}\n`;
    for (let i = 0; i < 24; i++) {
      randStr += caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length));
    }
    matrixOverlay.innerText = randStr;
    contadorFase++;
  }, 40);
}

function detenerEfectoMatrix() {
  clearInterval(matrixInterval);
  matrixOverlay.classList.add("hidden");
}

let intentosFallidos = 0;

function abrirTimeline() {
  if (audioActivado) { cambiarVolumenSuave(audios.musica, 0.05, 600); }
  
  iniciarEfectoMatrix();

  // Precarga fluida en segundo plano
  modelsOverlay.classList.remove("hidden");
  modelsOverlay.style.opacity = "0";

  // Transición de 2.2 segundos para asegurar renderizado 3D sin lagazos
  setTimeout(() => {
    detenerEfectoMatrix();
    modelsOverlay.style.opacity = "";
    requestAnimationFrame(() => {
      modelsOverlay.classList.add("active");
      checkScrollReveal();
    });
  }, 2200);
}

function verificarClave() {
  const password = passInput.value.trim().toUpperCase();

  if (password === "P28!") {
    const ahora = new Date().getTime();
    const tiempoRestante = fechaObjetivo - ahora;

    if (tiempoRestante > 0 && !modoDemoActivo) {
      consoleStatus.innerText = ">> YOU KNOW THE SECRET, BUT IT IS NOT TIME YET...";
      
      if (audioActivado) {
        audios.wrong.pause();
        audios.glitch.pause();
        audios.dudin.currentTime = 0;
        audios.dudin.play().catch(() => {});
      }

      mainTerminal.classList.add("glitch-shake");
      setTimeout(() => { mainTerminal.classList.remove("glitch-shake"); }, 400);
      return;
    }

    intentosFallidos = 0;
    consoleStatus.innerText = ">> ACCESS GRANTED: MATERIALIZING ARTIFACTS...";
    
    if (audioActivado) {
      audios.wrong.pause(); audios.glitch.pause(); audios.dudin.pause();
      audios.granted.currentTime = 0; audios.granted.play().catch(() => {});
    }

    consoleSection.classList.add("hidden");
    unlockedPanel.classList.remove("hidden");
    sysStatusLabel.innerText = "STATUS: UNLOCKED";
    mainTitle.innerText = "TIME CAPSULE SYSTEM";
    subHeader.innerText = "TECHNOLOGICAL EVOLUTION LOGGED";

    abrirTimeline();

  } else {
    intentosFallidos++;
    if (intentosFallidos >= 3) {
      consoleStatus.innerText = ">> SECURITY ALERT! SYSTEM OVERLOAD.";
      if (audioActivado) {
        audios.wrong.pause();
        audios.glitch.currentTime = 0; audios.glitch.play().catch(() => {});
      }
      mainTerminal.classList.add("glitch-shake");
      setTimeout(() => { mainTerminal.classList.remove("glitch-shake"); }, 450);
    } else {
      consoleStatus.innerText = `>> INVALID PASSCODE. ATTEMPT [${intentosFallidos}/3].`;
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
  if (!viewer) return;
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

// CONFIGURACIÓN DE CLICS DE LOS 8 MODELOS
configurarInteraccionClick("mvBb", datosModelos.blackberry);
configurarInteraccionClick("mvSmart", datosModelos.smartphone);
configurarInteraccionClick("mvMouseWired", datosModelos.mouseWired);
configurarInteraccionClick("mvMouseWireless", datosModelos.mouseWireless);
configurarInteraccionClick("mvWiredAudio", datosModelos.wiredHeadphones);
configurarInteraccionClick("mvAirpods", datosModelos.airpods);
configurarInteraccionClick("mvDvd", datosModelos.dvd);
configurarInteraccionClick("mvUsb", datosModelos.usbDrive);

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

// COUNTDOWN & PROGRESS BAR CONTROLLER
let modoDemoActivo = false;
let progresoDemo = 0;

function actualizarContador() {
  if (modoDemoActivo) {
    if (progresoDemo < 100) {
      progresoDemo += 4;
      if (progresoDemo > 100) progresoDemo = 100;

      progressBar.style.width = `${progresoDemo}%`;
      percentText.innerText = `DECRYPTION PROGRESS: ${progresoDemo}%`;
      decryptText.innerText = `PASSCODE: ${generarTextoAleatorio(4)}`;
      timerDisplay.innerText = `TIME REMAINING: 00D 00H 00M 0${Math.max(0, 5 - Math.floor(progresoDemo / 20))}S`;

      if (audioActivado) {
        audios.tick.currentTime = 0; audios.tick.play().catch(() => {});
      }
    } else {
      timerDisplay.innerText = "TIME REMAINING: 00D 00H 00M 00S";
      iniciarReveladoSecuencial();
      decryptText.innerText = `PASSCODE: ${obtenerTextoMatrizORevelado()}`;
    }
    return;
  }

  // REAL TIME
  const ahora = new Date().getTime();
  const diferencia = fechaObjetivo - ahora;

  if (diferencia <= 0) {
    progressBar.style.width = "100%";
    percentText.innerText = "DECRYPTION PROGRESS: 100%";
    timerDisplay.innerText = "TIME REMAINING: 00D 00H 00M 00S";
    
    if (bootFinalizado) {
      iniciarReveladoSecuencial();
      decryptText.innerText = `PASSCODE: ${obtenerTextoMatrizORevelado()}`;
    } else {
      decryptText.innerText = `PASSCODE: ${generarTextoAleatorio(4)}`;
    }
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  timerDisplay.innerText = `TIME REMAINING: ${dias}D ${horas}H ${minutos}M ${segundos}S`;

  const unAnoEnMs = 365 * 24 * 60 * 60 * 1000;
  const tiempoTranscurrido = unAnoEnMs - (diferencia % unAnoEnMs);
  const progreso = Math.min(99, Math.max(0, Math.floor((tiempoTranscurrido / unAnoEnMs) * 100)));
  
  progressBar.style.width = `${progreso}%`;
  percentText.innerText = `DECRYPTION PROGRESS: ${progreso}%`;
  decryptText.innerText = `PASSCODE: ${generarTextoAleatorio(4)}`;
}

setInterval(actualizarContador, 80);

// SECRET "bill" KEY DETECTOR
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

  mainTerminal.classList.add("bill-shake-effect");
  setTimeout(() => {
    mainTerminal.classList.remove("bill-shake-effect");
  }, 600);

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
// EFECTO DE SONIDO AL PASAR EL CURSOR POR LAS TARJETAS 3D
document.querySelectorAll(".model-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    if (audioActivado) {
      audios.tick.currentTime = 0;
      audios.tick.play().catch(() => {});
    }
  });
});

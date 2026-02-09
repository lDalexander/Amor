// ==========================================
// CONFIGURACIÓN: CAMBIA ESTA FECHA
const fechaInicio = new Date(2023, 1, 14, 18, 00); // Año, Mes-1, Día, Hora, Min
// ==========================================

const textoTitulo = "Para el amor de mi vida";
const textoSubtitulo = "Mi amor por ti comenzó hace...";
const textoMensaje = "Y cada día crece más, como este árbol.";

let secuenciaIniciada = false;

function iniciarSecuencia() {
    if (secuenciaIniciada) return;
    secuenciaIniciada = true;

    // 1. Ocultar pantalla de inicio
    const startScreen = document.getElementById('start-screen');
    startScreen.style.opacity = '0';
    setTimeout(() => startScreen.style.display = 'none', 800);

    // 2. Iniciar animación del Tronco
    const trunk = document.getElementById('trunk');
    trunk.classList.remove('hidden-element');
    trunk.classList.add('grow-trunk');

    // 3. Iniciar animación de las Hojas (después de que crezca el tronco)
    setTimeout(() => {
        crearHojasFrondosas();
    }, 1500); // Espera 1.5s a que el tronco termine

    // 4. Mover el árbol y Mostrar el Texto (después de que el árbol se llene)
    setTimeout(() => {
        // Mover árbol a la derecha y mostrar contenedor de texto
        document.getElementById('text-group').classList.add('show-text-group');
        
        // Iniciar secuencia de textos
        setTimeout(() => {
            escribirTexto('titulo', textoTitulo, 80, () => {
                escribirTexto('subtitulo', textoSubtitulo, 70, () => {
                    // Mostrar contador
                    document.getElementById('timer-container').classList.remove('hidden-element');
                    document.getElementById('timer-container').classList.add('visible');
                    actualizarContador();
                    setInterval(actualizarContador, 1000);

                    // Último mensaje y hojas cayendo
                    escribirTexto('mensaje-final', textoMensaje, 70, () => {
                        setInterval(crearHojaCayendo, 1000);
                    });
                });
            });
        }, 1000); // Espera 1s después de moverse para empezar a escribir
    }, 4000); // Espera 4s en total para que el árbol esté listo
}

// Función de Máquina de Escribir
function escribirTexto(id, text, speed, callback) {
    let i = 0;
    const element = document.getElementById(id);
    element.classList.add('typewriter');
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typewriter');
            if (callback) callback();
        }
    }
    type();
}

// Contador de Tiempo
function actualizarContador() {
    const diff = new Date() - fechaInicio;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById("contador").innerText = `${d} Días ${h}h ${m}m ${s}s`;
}

// Crear Hojas en forma de Corazón (Copa del árbol)
function crearHojasFrondosas() {
    const contenedor = document.getElementById("heart-leaves");
    const colores = ["#d90429", "#ef233c", "#ff4d6d", "#ff758f", "#ff8fa3"];
    
    for (let i = 0; i < 200; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        
        // Lógica para formar un corazón gigante con las hojas
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 180; // Radio máximo
        // Fórmulas paramétricas aproximadas para un corazón
        const x = r * 1.2 * Math.pow(Math.sin(angle), 3);
        const y = -r * (0.8 * Math.cos(angle) - 0.3 * Math.cos(2*angle) - 0.1 * Math.cos(3*angle) - 0.05 * Math.cos(4*angle));

        heart.style.bottom = `${y + 350}px`; // Elevar la copa
        heart.style.left = `calc(50% + ${x}px)`;
        
        const color = colores[Math.floor(Math.random() * colores.length)];
        const scale = Math.random() * 0.8 + 0.4;
        
        heart.style.setProperty('--scale', scale);
        heart.style.backgroundColor = color;
        
        const style = document.createElement('style');
        style.innerHTML = `.heart:nth-child(${i+1})::before, .heart:nth-child(${i+1})::after { background-color: ${color}; }`;
        document.head.appendChild(style);

        // Retraso aleatorio para que "florezcan"
        setTimeout(() => {
            heart.classList.add('bloom');
        }, Math.random() * 2000);

        contenedor.appendChild(heart);
    }
}

// Crear Hojas Cayendo
function crearHojaCayendo() {
    const contenedor = document.getElementById("tree-container");
    const colores = ["#ff4d6d", "#ff758f"];
    const heart = document.createElement("div");
    heart.classList.add("falling-heart");

    const color = colores[Math.floor(Math.random() * colores.length)];
    heart.style.backgroundColor = color;
    heart.style.left = `calc(50% + ${Math.random() * 300 - 150}px)`;

    const style = document.createElement('style');
    style.innerHTML = `.falling-heart:last-child::before, .falling-heart:last-child::after { background-color: ${color}; }`;
    document.head.appendChild(style);

    contenedor.appendChild(heart);
    setTimeout(() => { heart.remove(); style.remove(); }, 5000);
}
// Iniciar
crearArbol();
actualizarContador();

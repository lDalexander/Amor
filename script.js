// ==========================================
// CONFIGURACIÓN: CAMBIA ESTA FECHA POR LA SUYA
// Formato: Año, Mes (0 = Enero, 1 = Febrero...), Día, Hora, Minutos
const fechaInicio = new Date(2023, 1, 14, 18, 00); 
// Ejemplo arriba: 14 de Febrero de 2023 a las 6:00 PM
// ==========================================

function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById("contador").innerText = 
        `${dias} Días ${horas}h ${minutos}m ${segundos}s`;
}

setInterval(actualizarContador, 1000); // Actualiza cada segundo

// Lógica para crear el árbol de corazones
function crearArbol() {
    const contenedor = document.getElementById("heart-leaves");
    const colores = ["#ff4d6d", "#c9184a", "#ff758f", "#ff8fa3"]; // Variedad de rosas/rojos
    
    // Crear 60 corazones
    for (let i = 0; i < 60; i++) {
        const corazon = document.createElement("div");
        corazon.classList.add("heart");
        
        // Posición aleatoria arriba del tronco para formar la copa
        // Ajustamos los valores 'bottom' y 'left' para que parezca un árbol
        const bottom = Math.random() * 100 + 130; // Altura desde el suelo
        const left = Math.random() * 160 - 80;    // Dispersión horizontal (centrado)
        
        corazon.style.bottom = `${bottom}px`;
        corazon.style.left = `calc(50% + ${left}px)`;
        
        // Color y tamaño aleatorio
        corazon.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        
        // Ajustar pseudo-elementos al mismo color (truco de CSS)
        const style = document.createElement('style');
        style.innerHTML = `
            .heart:nth-child(${i+1})::before, 
            .heart:nth-child(${i+1})::after { 
                background-color: ${corazon.style.backgroundColor}; 
            }
        `;
        document.head.appendChild(style);

        // Retraso aleatorio para la animación (para que no aparezcan todos de golpe)
        corazon.style.animationDelay = `${Math.random() * 2}s`;

        contenedor.appendChild(corazon);
    }
}

// Iniciar
crearArbol();
actualizarContador();

document.addEventListener('DOMContentLoaded', () => {
    const startDate = new Date('2025-02-14T00:00:00');
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const card = document.getElementById('card');
    const canvas = document.getElementById('tree-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let animationId;

    startBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        setTimeout(() => {
            startScreen.style.display = 'none';
            startAnimation();
        }, 1000);
    });

    function startAnimation() {
        const startX = canvas.width / 2;
        const startY = canvas.height;
        const trunkLength = 150;
        const trunkThickness = 20;

        // Dibuvamos el tronco base
        // Iniciamos contador de ramas activas para saber cuándo terminar
        activeBranches = 1;
        drawBranch(startX, startY, trunkLength, 0, trunkThickness, 0);
    }

    let activeBranches = 0;

    function drawBranch(x, y, len, angle, width, depth) {
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = "#5D4037"; // Marrón madera
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);
        ctx.stroke();
        ctx.restore();

        // Calcular fin de la rama actual para la siguiente
        const endX = x + len * Math.sin(angle * Math.PI / 180);
        const endY = y - len * Math.cos(angle * Math.PI / 180);

        // Condición de parada para el fractal de ramas
        // Hacemos el árbol más compacto (depth 5 en vez de 6 si se ve muy grande, pero 6 está bien con ángulo menor)
        if (depth > 5 || len < 15) {
            activeBranches--;
            if (activeBranches <= 0) {
                setTimeout(bloomHeartAttributes, 500); // Pequeña pausa dramática antes de florecer
            }
            return;
        }

        // Ramificación simple para el soporte
        setTimeout(() => {
            // Angulos ajustados: DE 25 a 15 para que sea más "cerrado" y no tan "fuera"
            const newDepth = depth + 1;

            // Incrementamos por las 2 nuevas ramas que nacerán
            activeBranches += 2;

            drawBranch(endX, endY, len * 0.75, angle - 15, width * 0.7, newDepth);
            drawBranch(endX, endY, len * 0.75, angle + 15, width * 0.7, newDepth);

            // Decrementamos la rama actual que ya "dio a luz"
            activeBranches--;
            if (activeBranches <= 0) {
                setTimeout(bloomHeartAttributes, 500);
            }
        }, 150);
    }

    let blooming = false;
    function bloomHeartAttributes() {
        if (blooming) return;
        blooming = true;

        // Configuracion del Corazón Gigante
        const centerX = canvas.width / 2;
        // Subimos el corazón para que tape las ramas superiores (Y menor es más arriba)
        const centerY = canvas.height - 380;
        const heartScale = 15; // Más grande para cubrir todo el follaje
        const totalLeaves = 2500; // Aún más denso para tapar huecos

        // Efecto de brillo para las hojas
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 105, 180, 0.5)"; // Resplandor rosa

        let createdLeaves = 0;

        function createLeafBatch() {
            // Generar menos hojas por frame para que la animación dure más (aprox 3-4 seg)
            for (let i = 0; i < 8; i++) {
                if (createdLeaves >= totalLeaves) break;

                // Formula del corazón paramétrica
                // Aleatoriedad para rellenar el interior:
                // Usamos sqrt(random) para distribución uniforme en área circular, aplica similar aquí
                const t = Math.random() * Math.PI * 2;
                // Radio variable para rellenar, más denso en bordes o uniforme
                // r se distribuye para llenar el volumen
                let r = Math.sqrt(Math.random());
                // A veces queremos que el borde esté más definido
                if (Math.random() < 0.3) r = 0.9 + Math.random() * 0.1; // 30% en el borde

                // Formula:
                // x = 16 sin^3 t
                // y = 13 cos t - 5 cos 2t - 2 cos 3t - cos 4t
                const xNorm = 16 * Math.pow(Math.sin(t), 3);
                const yNorm = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

                // Posición final
                const x = centerX + xNorm * heartScale * r;
                const y = centerY - yNorm * heartScale * r; // Menos Y porque canvas Y crece abajo

                particles.push({
                    x: x,
                    y: y,
                    targetSize: Math.random() * 8 + 4,
                    currentSize: 0,
                    color: getRandomPinkColor(),
                    rotation: Math.random() * Math.PI * 2
                });
                createdLeaves++;
            }

            if (createdLeaves < totalLeaves) {
                requestAnimationFrame(createLeafBatch);
            } else {
                // Terminado de generar, mostrar tarjeta pronto
                setTimeout(showCard, 1000);
            }
        }
        createLeafBatch();
        animateLeaves();
    }

    function getRandomPinkColor() {
        const colors = [
            '#ff4d6d', // Rosa fuerte
            '#c9184a', // Rojo oscuro
            '#ff758f', // Rosa claro
            '#ffb3c1', // Rosa pastel
            '#800f2f'  // Vino
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function animateLeaves() {
        // Render loop para las hojas: Crecen suavemente (pop-in)
        // No limpiamos el canvas completo para no borrar el tronco
        // TRUCO: Solo animamos "haciendo crecer" las hojas
        // Como no podemos borrar sin borrar el tronco, asumimos que solo crecen y se quedan.
        // Si quisieramos movimiento (sway), necesitariamos redibujar el tronco o usar capas.
        // Dado que el tronco ya se dibujó en el canvas, dibujaremos hojas encima.

        let active = false;
        particles.forEach(p => {
            if (p.currentSize < p.targetSize) {
                p.currentSize += 0.2; // Velocidad de crecimiento
                drawHeartShape(p.x, p.y, p.currentSize, p.color, p.rotation);
                active = true;
            }
        });

        if (active) {
            requestAnimationFrame(animateLeaves);
        }
    }

    function drawHeartShape(x, y, size, color, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.beginPath();
        // Dibujo de un corazón pequeño (pétalo)
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
        ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    function showCard() {
        card.classList.remove('hidden');
        card.style.display = 'block';
        // Reflow
        void card.offsetWidth;
        card.classList.add('visible');
    }

    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;

        if (diff < 0) {
            document.getElementById('timer').innerText = "Próximamente...";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('timer').innerText =
            `${days} Días, ${hours} Hs, ${minutes} Min, ${seconds} Seg`;
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Reiniciar si se cambia tamaño es complejo, mejor dejarlo o recargar
    });
});

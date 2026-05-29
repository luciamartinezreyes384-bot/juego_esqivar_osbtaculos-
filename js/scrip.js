document.addEventListener('DOMContentLoaded', () => {
    // ELEMENTOS
    const pista = document.getElementById('pista');
    const jugador = document.getElementById('jugador');
    const obstaculo = document.getElementById('obstaculo');
    const mensaje = document.getElementById('mensaje');
    const spanPuntos = document.getElementById('puntos');
    const spanNivel = document.getElementById('nivel');
    const btnIniciar = document.getElementById('btnIniciar');
    const btnReiniciar = document.getElementById('btnReiniciar');

    // VARIABLES
    let puntos = 0;
    let nivel = 1;
    let juegoActivo = false;
    let posJugador = 50; // % horizontal
    let velocidad = 5;
    let intervalo;
    let anchoPista = pista.clientWidth;

    // 🎮 CONTROL TECLADO
    document.addEventListener('keydown', (e) => {
        if (!juegoActivo) return;
        if (e.key === 'ArrowLeft' && posJugador > 15) {
            posJugador -= 8;
            jugador.style.left = posJugador + '%';
        }
        if (e.key === 'ArrowRight' && posJugador < 85) {
            posJugador += 8;
            jugador.style.left = posJugador + '%';
        }
    });

    // 🚀 NUEVO OBSTÁCULO
    function nuevoObstaculo() {
        let posAleatoria = Math.floor(Math.random() * 70) + 15;
        obstaculo.style.left = posAleatoria + '%';
        obstaculo.style.top = '-60px';
    }

    // ⚔️ COLISIÓN
    function hayColision() {
        const jRect = jugador.getBoundingClientRect();
        const oRect = obstaculo.getBoundingClientRect();
        return !(
            jRect.top > oRect.bottom ||
            jRect.bottom < oRect.top ||
            jRect.left > oRect.right ||
            jRect.right < oRect.left
        );
    }

    // 📈 SUBIR NIVEL
    function actualizarNivel() {
        if (puntos >= nivel * 20) {
            nivel++;
            velocidad += 1.2;
            spanNivel.textContent = nivel;
            clearInterval(intervalo);
            iniciarLoop();
        }
    }

    // 🔁 LOOP DEL JUEGO
    function iniciarLoop() {
        intervalo = setInterval(() => {
            if (!juegoActivo) return;

            // Mover obstáculo
            let posY = parseInt(obstaculo.style.top || -60);
            posY += velocidad;
            obstaculo.style.top = posY + 'px';

            // Pasó sin chocar → suma puntos
            if (posY > pista.clientHeight) {
                puntos += 5;
                spanPuntos.textContent = puntos;
                nuevoObstaculo();
                actualizarNivel();
            }

            // 💥 COLISIÓN → FIN
            if (hayColision()) {
                juegoActivo = false;
                clearInterval(intervalo);
                mensaje.textContent = `💥 ¡CHOCARSTE!\nPuntos: ${puntos}`;
                mensaje.style.display = 'block';
            }

        }, 30);
    }

    // ▶️ INICIAR
    btnIniciar.addEventListener('click', () => {
        if (juegoActivo) return;
        juegoActivo = true;
        puntos = 0;
        nivel = 1;
        velocidad = 5;
        spanPuntos.textContent = puntos;
        spanNivel.textContent = nivel;
        mensaje.style.display = 'none';
        jugador.style.left = '50%';
        posJugador = 50;
        nuevoObstaculo();
        iniciarLoop();
    });

    // 🔄 REINICIAR
    btnReiniciar.addEventListener('click', () => {
        juegoActivo = false;
        clearInterval(intervalo);
        puntos = 0;
        nivel = 1;
        velocidad = 5;
        spanPuntos.textContent = puntos;
        spanNivel.textContent = nivel;
        mensaje.style.display = 'none';
        jugador.style.left = '50%';
        posJugador = 50;
        nuevoObstaculo();
    });
});

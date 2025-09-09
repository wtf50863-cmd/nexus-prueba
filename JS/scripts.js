// Carrusel 1
const contenedor1 = document.querySelector('.contendedor-carrousel-1');
const motor1 = contenedor1.querySelector('.motor-carrousel');
const btnIzquierda1 = contenedor1.querySelector('.btn-izquierda-carrousel');
const btnDerecha1 = contenedor1.querySelector('.btn-derecha-carrousel');
const items1 = contenedor1.querySelectorAll('.item-carrousel');

// Carrusel 2
const contenedor2 = document.querySelector('.contendedor-carrousel-2');
const motor2 = contenedor2.querySelector('.motor-carrousel');
const btnIzquierda2 = contenedor2.querySelector('.btn-izquierda-carrousel');
const btnDerecha2 = contenedor2.querySelector('.btn-derecha-carrousel');
const items2 = contenedor2.querySelectorAll('.item-carrousel');


let currentIndex1 = 0; // Índice de la diapositiva actual

// Función para mover el carrusel
function moverCarrusel(motor, index, items) {
    const itemWidth = items[0].getBoundingClientRect().width;
    const itemMarginRight = parseInt(window.getComputedStyle(items[0]).marginRight);
    const displacement = (itemWidth + itemMarginRight) * index;
    motor.style.transform = `translateX(-${displacement}px)`;
}

// Evento para el botón derecho del carrousel 1
btnDerecha1.addEventListener('click', () => {
    // Si no estamos en la última diapositiva
    if (currentIndex1 < items1.length - 3) {
        currentIndex1++;
        moverCarrusel(motor1, currentIndex1, items1);
    }
});

// Evento para el botón izquierdo del carrousel 1
btnIzquierda1.addEventListener('click', () => {
    // Si no estamos en la primera diapositiva
    if (currentIndex1 > 0) {
        currentIndex1--;
        moverCarrusel(motor1, currentIndex1, items1);
    }
});

// Evento para el botón derecho del carrousel 1
btnDerecha2.addEventListener('click', () => {
    // Si no estamos en la última diapositiva
    if (currentIndex1 < items1.length - 3) {
        currentIndex1++;
        moverCarrusel(motor2, currentIndex1, items2);
    }
});

// Evento para el botón izquierdo del carrousel 1
btnIzquierda2.addEventListener('click', () => {
    // Si no estamos en la primera diapositiva
    if (currentIndex1 > 0) {
        currentIndex1--;
        moverCarrusel(motor2, currentIndex1, items2);
    }
});
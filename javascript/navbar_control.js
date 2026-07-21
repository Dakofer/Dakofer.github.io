// js/load-navbar.js

document.addEventListener('DOMContentLoaded', function() {
    const navbarContainer = document.getElementById('navbar-container');
    const modalContainer = document.getElementById('modal-container'); // nuevo contenedor

    if (!navbarContainer || !modalContainer) {
        console.error('Faltan contenedores para el navbar o el modal');
        return;
    }

    // 1. Cargar navbar
    fetch('/component/navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar navbar');
            return response.text();
        })
        .then(navbarHtml => {
            navbarContainer.innerHTML = navbarHtml;

            // 2. Cargar modal
            return fetch('/component/carrito.html');
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar modal');
            return response.text();
        })
        .then(modalHtml => {
            modalContainer.innerHTML = modalHtml;

            // 3. Inicializar Flowbite (para dropdowns y collapse)
            if (typeof initFlowbite !== 'undefined') {
                initFlowbite();
            }

            // 4. Inicializar lógica del carrito
            if (typeof initCart === 'function') {
                initCart();
            } else {
                console.warn('initCart no está definida');
            }
        })
        .catch(error => {
            console.error('Error al cargar componentes:', error);
            navbarContainer.innerHTML = '<p style="color:red;">Error al cargar el menú.</p>';
        });
});
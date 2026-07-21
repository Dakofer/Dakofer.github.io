// js/carrito.js

function initCart() {
    const modal = document.getElementById('cartModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');

    if (!modal || !openBtn || !closeBtn) {
        console.warn('No se encontraron los elementos del carrito');
        return;
    }

    // Abrir modal
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    // Cerrar modal (botón)
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}
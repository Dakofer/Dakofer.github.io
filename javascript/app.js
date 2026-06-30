class CatalogManager {
  constructor() {
    this.products = [];
    this.isLoaded = false;
  }

  // Cargar productos desde JSON
  async loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al descargar el JSON');
      const data = await response.json();
      
      // Si el JSON es un objeto con claves, lo convertimos a arreglo
      const productsArray = Array.isArray(data) ? data : Object.values(data);

      this.products = productsArray.map(item => ({
        id: item.id || `p${Date.now()}_${Math.random()}`,
        name: item.nombre || 'Sin nombre',
        price: item.precio || 0,
        image: item.imagen || '',
        description: item.descripcion || '',
        url: item.url || ''
      }));

      this.isLoaded = true;
      console.log(`✅ ${this.products.length} productos cargados.`);
      return this.products;
    } catch (error) {
      console.error(' Error cargando JSON:', error);
      this.isLoaded = false;
      return [];
    }
  }

  // Buscar producto por ID
  getProductById(id) {
    if (!this.isLoaded) {
      console.warn(' Carga productos primero.');
      return null;
    }
    return this.products.find(p => p.id === id) || null;
  }

  // ⭐ RENDERIZAR UN PRODUCTO CON DOM API (con tu diseño)
  renderProduct(productId, containerElement) {
    if (!containerElement) {
      console.error(' Contenedor no válido.');
      return;
    }

    const product = this.getProductById(productId);
    if (!product) {
      containerElement.innerHTML = `<p style="color:red;">Producto no encontrado</p>`;
      return;
    }

    // ----- CONTENEDOR PRINCIPAL (card) -----
    const card = document.createElement('div');
    card.className = 'contenedor-recorte img bg-neutral-primary-soft color-card block max-w-sm border border-default rounded-lg shadow-xs';

    // ----- IMAGEN (con enlace) -----
    const linkImg = document.createElement('a');
    linkImg.href = product.url;
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    linkImg.appendChild(img);
    card.appendChild(linkImg);

    // ----- GRID INTERIOR (3 columnas) -----
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-3 gap-4';

    // ----- COLUMNA IZQUIERDA (nombre y precio) -----
    const colLeft = document.createElement('div');
    colLeft.className = 'p-3 col-span-2 text-center';

    // Nombre (con enlace)
    const linkName = document.createElement('a');
    linkName.href = product.url;
    const nameP = document.createElement('p');
    nameP.className = 'mt-4 tracking-tight text-white text-heading';
    nameP.textContent = product.name; // textContent escapa
    linkName.appendChild(nameP);
    colLeft.appendChild(linkName);

    // Precio (con enlace)
    const linkPrice = document.createElement('a');
    linkPrice.href = product.url;
    linkPrice.className = 'inline-flex text-white text-sm py-2.5';
    linkPrice.textContent = `$${product.price}`;
    colLeft.appendChild(linkPrice);

    grid.appendChild(colLeft);

    // ----- COLUMNA DERECHA (botón carrito) -----
    const colRight = document.createElement('div');
    colRight.className = 'mt-8 text-center';

    // Botón
    const btnCart = document.createElement('button');
    btnCart.type = 'button';
    linkPrice.href = product.url;
    btnCart.className = 'inline-flex items-center justify-center text-white color-cart hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs rounded-full w-10 h-9 focus:outline-none';

    // SVG del carrito (ícono)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke', 'currentColor');
    svg.classList.add('size-6');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('d', 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z');
    svg.appendChild(path);
    btnCart.appendChild(svg);

    // Texto accesible (sr-only)
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Añadir al carrito';
    btnCart.appendChild(srOnly);

    // ⭐ EVENTO DE CLIC para redirigir a product.url
    btnCart.addEventListener('click', (e) => {
      e.preventDefault();
      if (product.url) {
        window.open(product.url, '_blank'); // Abre en nueva pestaña
      } else {
        alert('Este producto no tiene enlace disponible.');
      }
    });

    colRight.appendChild(btnCart);
    grid.appendChild(colRight);
    card.appendChild(grid);

    // ----- LIMPIAR Y AGREGAR AL CONTENEDOR -----
    containerElement.innerHTML = '';
    containerElement.appendChild(card);
  }

  // Renderizar TODOS los productos
  renderAll(containerElement) {
    if (!containerElement) return;
    containerElement.innerHTML = '';
    this.products.forEach(product => {
      const tempDiv = document.createElement('div');
      this.renderProduct(product.id, tempDiv);
      containerElement.appendChild(tempDiv.firstElementChild);
    });
  }

  // Renderizar SOLO favoritos (necesita FavoritesManager)
  renderFavorites(containerElement) {
    if (!containerElement) return;
    const favManager = new FavoritesManager();
    const favoriteIds = favManager.getFavorites();
    if (favoriteIds.length === 0) {
      containerElement.innerHTML = `<p>💔 Aún no tienes favoritos.</p>`;
      return;
    }
    containerElement.innerHTML = '';
    favoriteIds.forEach(id => {
      const product = this.getProductById(id);
      if (product) {
        const tempDiv = document.createElement('div');
        this.renderProduct(product.id, tempDiv);
        containerElement.appendChild(tempDiv.firstElementChild);
      }
    });
  }
}

(async function() {
  const miCatalogo = new CatalogManager();
  await miCatalogo.loadJSON('/xml/productos.json'); // ruta a tu JSON

  // Renderizar todos los productos en el contenedor
  const catalogo = document.getElementById('catalogo-container');
  miCatalogo.renderAll(catalogo);

  // Renderizar favoritos en otro contenedor
  const favoritos = document.getElementById('favoritos-container');
  miCatalogo.renderFavorites(favoritos);

  // También puedes renderizar un producto específico:
  // miCatalogo.renderProduct('p001', document.getElementById('destacado'));
})();
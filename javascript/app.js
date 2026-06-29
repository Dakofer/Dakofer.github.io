class CatalogManager {
  constructor() {
    this.products = [];      // Aquí guardaremos todos los productos parseados
    this.isLoaded = false;
  }

  // Método para cargar y parsear el XML desde internet
  async loadXML(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al descargar el XML');
      
      const xmlString = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // Extraemos todos los productos
      const productNodes = xmlDoc.querySelectorAll('product');
      this.products = [];

      productNodes.forEach(node => {
        const id = node.getAttribute('id');
        const name = node.querySelector('nombre')?.textContent || 'Sin nombre';
        const price = node.querySelector('precio')?.textContent || '0';
        const image = node.querySelector('imagen')?.textContent || '';
        const description = node.querySelector('descripcion')?.textContent || '';

        this.products.push({ id, name, price, image, description });
      });

      this.isLoaded = true;
      console.log(`✅ ${this.products.length} productos cargados correctamente.`);
      return this.products;
      
    } catch (error) {
      console.error('❌ Error cargando el XML:', error);
      this.isLoaded = false;
      return [];
    }
  }

  // Método para buscar un producto por su ID
  getProductById(id) {
    if (!this.isLoaded) {
      console.warn('⚠️ Aún no se han cargado los productos. Ejecuta loadXML primero.');
      return null;
    }
    return this.products.find(product => product.id === id) || null;
  }

  // Método para obtener productos por categoría (si tuvieras) o por filtro personalizado
  getProductsByFilter(callback) {
    if (!this.isLoaded) return [];
    return this.products.filter(callback);
  }

  // ⭐ EL MÉTODO MÁGICO: Renderiza UN SOLO producto en el contenedor que tú quieras
  renderProduct(productId, containerElement) {
    if (!containerElement) {
      console.error('❌ No especificaste un contenedor HTML válido.');
      return;
    }

    const product = this.getProductById(productId);
    if (!product) {
      containerElement.innerHTML = `<p style="color:red;">Producto con ID "${productId}" no encontrado.</p>`;
      return;
    }

    // Aquí construyes la tarjeta HTML como tú quieras (puedes personalizar el diseño)
    containerElement.innerHTML = `
                        <div class="contenedor-recorte img bg-neutral-primary-soft color-card block max-w-sm border border-default rounded-lg shadow-xs">
                            <a href="# ">
                                <img class=" " src="${product.image}" alt="${product.name}" />
                            </a>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="p-3 col-span-2 text-center">
                               
                                    <a href="#">
                                        <p class="mt-4 tracking-tight text-white text-heading ">${product.name}</p>
                                    </a>
                                    <a href="#" class="inline-flex  text-white text-sm py-2.5">
                                        $${product.price}
                                    </a>
                               
                                </div>
                                <div class="mt-8 text-center">
                                    
                                <button type="button" class="inline-flex items-center justify-center  text-white color-cart hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs rounded-full w-10 h-9 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                    <span class="sr-only">Icon description</span>
                                </button>
                                            
                                </div>
                            </div>
                        </div>
    `;
  }

  // (Opcional) Si aún quieres renderizar TODOS los productos en un solo lugar
  renderAll(containerElement) {
    if (!containerElement) return;
    containerElement.innerHTML = ''; // Limpiar
    this.products.forEach(product => {
      const tempDiv = document.createElement('div');
      this.renderProduct(product.id, tempDiv);
      containerElement.appendChild(tempDiv.firstElementChild);
    });
  }
}

// Exportamos la clase para usarla en otros archivos (si usas módulos)
export default CatalogManager;
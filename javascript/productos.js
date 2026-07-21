const params = new URLSearchParams(window.location.search);
const id = params.get('id'); // devuelve 'p001' o null si no existe

// Suponiendo que tienes un archivo productos.json con todos los productos
fetch('/xml/productos.json')
    .then(res => res.json())
    .then(productos => {
        const producto = productos.find(p => p.id === id);
        const contenedor = document.getElementById('detalle');
        
        if (producto) {
            contenedor.innerHTML = `
        <!-- ===== DETALLE PRODUCTO ===== -->
    <section class="product-detail">
        <div class="container">
            <div class="product-detail-grid">
                <!-- Imagen -->
                <div class="product-image">
                    <i class="fas fa-crystal-ball"></i>
                    <img src="${producto.imagen}" class="img product-image-detalle"/>
                    <!--<span class="badge">✨ Edición especial</span>-->
                </div>

                <!-- Info -->
                <div class="product-info">
                    <h1>${producto.nombre}</h1>

                    <div class="product-rating">
                        <span class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </span>
                        <span class="reviews">★★★★★ 4 Reviews</span>
                    </div>

                    <div class="product-price">$ ${producto.precio}</div>

                    <!-- Selector de modelo -->
                    <div class="model-selector">
                        <label for="modelSelect"><i class="fas fa-tag"></i> Select Model</label>
                        <select id="modelSelect">
                            <option value=${producto.precio} selected>${producto.model}/option>
                        </select>
                    </div>

                    <!-- Descripción -->
                    <p class="product-description">
                        ${producto.descripcion}
                    </p>

                    <!-- Botón y mensaje -->
                    <button class="btn-add" id="addToCartBtn">
                        <i class="fas fa-shopping-cart"></i> Add To Cart
                    </button>
                    <div id="cartMessage"></div>
                </div>
            </div>
        </div>
    </section>
      `;
        } else {
            contenedor.innerHTML = '<p>Producto no encontrado</p>';
        }
    })
    .catch(error => {
        document.getElementById('detalle').innerHTML = '<p>Error al cargar los productos</p>';
    });
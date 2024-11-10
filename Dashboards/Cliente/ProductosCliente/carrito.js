window.onload = function() {
    const savedCart = localStorage.getItem('cart');
    console.log('Cargando carrito desde localStorage:', savedCart);

    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart.productos)) {
            parsedCart.productos = [];
            console.log('No se encontraron productos en el carrito, inicializando como un arreglo vacío.');
            cargarProductosDesdeServidor(parsedCart.idCarrito);
        }

        const idCarrito = parsedCart.idCarrito;
        console.log('ID de carrito obtenido:', idCarrito);

        if (idCarrito) {
            cargarProductosCarrito(idCarrito);
        } else {
            console.log('No se encontró un idCarrito en localStorage.');
        }
    } else {
        const initialCart = { idCarrito: null, productos: [], cartCount: 0 };
        localStorage.setItem('cart', JSON.stringify(initialCart));
        console.log('No hay carrito guardado en localStorage. Inicializando un nuevo carrito.');
    }
};

// Función para cargar productos desde el servidor
function cargarProductosDesdeServidor(idCarrito) {
    console.log(`Consultando productos para el carrito con id ${idCarrito} desde el servidor...`);

    fetch(`Modelos/obtener_productos_carrito.php?id_carrito=${idCarrito}`)
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener productos del servidor');
            return response.json();
        })
        .then(data => {
            if (!data.productos || data.productos.length === 0) {
                console.error('No se encontraron productos para este carrito.');
                return;
            }

            const savedCart = localStorage.getItem('cart');
            const parsedCart = savedCart ? JSON.parse(savedCart) : { idCarrito: null, productos: [], cartCount: 0 };
            parsedCart.productos = data.productos;
            localStorage.setItem('cart', JSON.stringify(parsedCart));

            cargarProductosCarrito(idCarrito);
        })
        .catch(error => {
            console.error('Error al obtener productos desde el servidor:', error);
        });
}

// Función para cargar los productos en el carrito desde el servidor
function cargarProductosCarrito(idCarrito) {
    console.log(`Solicitando productos para el carrito con id ${idCarrito}...`);

    fetch(`Modelos/obtener_productos_carrito.php?id_carrito=${idCarrito}`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            return response.json();
        })
        .then(data => {
            if (!data.productos) {
                console.error('No se encontraron productos en la respuesta del servidor');
                return;
            }

            const productosCarritoDiv = document.getElementById("productos-carrito");
            productosCarritoDiv.innerHTML = '';

            data.productos.forEach(producto => {
                const productoDiv = document.createElement("div");
                productoDiv.classList.add("producto-carrito");

                const imageUrl = `http://localhost/BIT_v1/assets/imgProducts/${producto.imagen_url.split('/').pop()}`;
                
                productoDiv.innerHTML = 
                `<img src="${imageUrl}" alt="${producto.nombre}" class="producto-imagen" />
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <div class="cantidad-container">
                    <button onclick="modificarCantidad(${producto.id_producto}, -1)" class="cantidad-btn">-</button>
                    <span id="cantidad-${producto.id_producto}">${producto.cantidad}</span>
                    <button onclick="modificarCantidad(${producto.id_producto}, 1)" class="cantidad-btn">+</button>
                    <button onclick="eliminarProducto(${producto.id_producto})" class="papelera">
                        <i class="fas fa-trash-alt"></i>
                    </button>   
                </div>`;
                productosCarritoDiv.appendChild(productoDiv);
            });

            const totalPriceElement = document.getElementById("total-price");
            totalPriceElement.textContent = (data.precio_total !== undefined) ? data.precio_total.toFixed(2) : '0.00';

        })
        .catch(error => console.error('Error al cargar los productos del carrito:', error));
}

// Función para modificar la cantidad de un producto
function modificarCantidad(productId, delta) {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return console.error('No hay carrito en localStorage');

    const parsedCart = JSON.parse(savedCart);
    const producto = parsedCart.productos.find(p => p.id_producto === productId);
    if (!producto) return console.error('Producto no encontrado en el carrito');

    let nuevaCantidad = producto.cantidad + delta;
    nuevaCantidad = Math.max(1, nuevaCantidad);

    const cantidadSpan = document.getElementById(`cantidad-${producto.id_producto}`);
    if (cantidadSpan) cantidadSpan.textContent = nuevaCantidad;

    producto.cantidad = nuevaCantidad;
    parsedCart.productos = parsedCart.productos.map(p => p.id_producto === productId ? { ...p, cantidad: nuevaCantidad } : p);
    localStorage.setItem('cart', JSON.stringify(parsedCart));

    fetch('Modelos/actualizar_cantidad_carrito.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idCarrito: parsedCart.idCarrito, idProducto: productId, cantidad: nuevaCantidad })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al actualizar el producto en el servidor');
        cargarProductosCarrito(parsedCart.idCarrito);
    })
    .catch(error => console.error('Error al actualizar el producto en el servidor:', error));
}

// Función para eliminar un producto del carrito
function eliminarProducto(productId) {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return console.error('No hay carrito en localStorage');

    const parsedCart = JSON.parse(savedCart);
    const carritoId = parsedCart.idCarrito; // Obtener el ID del carrito desde localStorage

    // Filtrar el producto a eliminar del array de productos
    const productosActualizados = parsedCart.productosEnCarrito.filter(id => id !== productId);
    
    // Actualizar el carrito en localStorage
    parsedCart.productosEnCarrito = productosActualizados;

    // Si no quedan productos en el carrito, borrar todo el localStorage
    if (productosActualizados.length === 0) {
        localStorage.removeItem('cart'); // Borrar el carrito completo
        console.log('Carrito vacío, localStorage eliminado');
    } else {
        localStorage.setItem('cart', JSON.stringify(parsedCart)); // Guardar el carrito actualizado en localStorage
    }

    // Llamar a la función para volver a cargar los productos del carrito (si es necesario)
    cargarProductosCarrito(carritoId);

    // Enviar la solicitud al servidor para eliminar el producto del carrito en la base de datos
    fetch('Modelos/eliminar_producto_carrito.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idCarrito: carritoId,
            idProducto: productId
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al eliminar el producto del servidor');
        console.log(`Producto ID ${productId} eliminado del servidor`);
        
        // Recargar la página si la eliminación fue exitosa
        location.reload();  // Recarga la página
    })
    .catch(error => console.error('Error al eliminar el producto en el servidor:', error));
}

// Función para actualizar el estado del carrito
function actualizarEstadoCarrito(estado) {
    // Obtener el carrito desde el localStorage
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) {
        console.error('No hay carrito en localStorage');
        return;
    }

    const parsedCart = JSON.parse(savedCart);
    const idCarrito = parsedCart.idCarrito; // Obtener el idCarrito desde el carrito guardado

    // Verificar si se encontró el idCarrito
    if (!idCarrito) {
        console.error('No se encontró el idCarrito');
        return;
    }

    // Enviar la solicitud para actualizar el estado del carrito en el servidor
    fetch('Modelos/actualizar_estado_carrito.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_carrito: idCarrito,
            estado: estado // El estado ahora se pasa como parámetro
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Estado del carrito actualizado a:', estado);
        } else {
            console.error('Error al actualizar el estado del carrito.');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud para actualizar el estado del carrito:', error);
    });
}

// Actualización del estado del carrito después de un pago exitoso
paypal.Buttons({
    createOrder: function(data, actions) {
        const total = document.getElementById('total-price').innerText;
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: total // Total calculado del carrito
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Mostrar un mensaje con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Pago completado!',
                text: 'Transacción realizada por ' + details.payer.name.given_name,
            }).then(() => {
                // Actualizar el estado del carrito a "completado"
                actualizarEstadoCarrito(1); 

                // Borrar todo el contenido del localStorage
                localStorage.clear();
                console.log('Carrito borrado del localStorage');
            });
        });
    },
    onCancel: function(data) {
        Swal.fire({
            icon: 'error',
            title: 'Pago cancelado',
            text: 'La transacción no se completó.',
        });
    },
    onError: function(err) {
        console.error('Error en el proceso de pago:', err);
    }
}).render('#paypal-button-container'); // Renderizar el botón PayPal

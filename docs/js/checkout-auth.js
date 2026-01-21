// ============================================
// PROTECCIÓN DE CHECKOUT - SOULINK
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Verificando acceso a checkout...');
    
    // Verificar autenticación usando AuthManager si existe
    if (typeof AuthManager !== 'undefined') {
        if (!AuthManager.protectCheckout()) {
            return; // Ya se redirigió a login
        }
    } else {
        // Fallback: verificación manual
        const sesionActiva = localStorage.getItem('sesionActiva');
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
        
        if (sesionActiva !== 'true' || !usuarioActual) {
            console.log('🔒 Acceso denegado - Requiere inicio de sesión');
            
            // Guardar carrito actual si existe
            const carrito = localStorage.getItem('soulink_carrito');
            if (carrito) {
                localStorage.setItem('soulink_pending_cart', carrito);
                localStorage.setItem('soulink_redirect_checkout', window.location.href);
            }
            
            // Redirigir a login
            window.location.href = 'login.html';
            return;
        }
        
        // Prellenar formulario con datos del usuario
        if (usuarioActual) {
            setTimeout(() => {
                const nombreInput = document.getElementById('nombre');
                const emailInput = document.getElementById('email');
                const telefonoInput = document.getElementById('telefono');
                
                if (nombreInput) nombreInput.value = usuarioActual.nombre || usuarioActual.nombre_completo || '';
                if (emailInput) emailInput.value = usuarioActual.email || '';
                if (telefonoInput) telefonoInput.value = usuarioActual.telefono || '';
                
                console.log('✅ Formulario de checkout prellenado');
            }, 500);
        }
    }
    
    // Cargar carrito desde localStorage
    loadCheckoutCart();
    
    // Actualizar navbar
    if (typeof AuthManager !== 'undefined') {
        AuthManager.updateNavbar();
    }
});

// Función para cargar carrito en checkout
function loadCheckoutCart() {
    try {
        const carritoData = localStorage.getItem('soulink_carrito') || 
                           localStorage.getItem('soulink_checkout_carrito');
        
        if (!carritoData) {
            console.log('🛒 No hay carrito para mostrar en checkout');
            showEmptyCart();
            return;
        }
        
        const carrito = JSON.parse(carritoData);
        console.log('🛒 Carrito cargado para checkout:', carrito.length, 'productos');
        
        // Mostrar resumen del carrito
        displayCartSummary(carrito);
        
    } catch (error) {
        console.error('❌ Error cargando carrito para checkout:', error);
        showEmptyCart();
    }
}

// Mostrar resumen del carrito en checkout
function displayCartSummary(carrito) {
    const cartSummary = document.getElementById('cartSummary');
    const orderSummary = document.getElementById('orderSummary');
    
    if (!cartSummary && !orderSummary) {
        console.log('⚠️ No se encontró elemento para mostrar resumen del carrito');
        return;
    }
    
    let subtotal = 0;
    let html = '';
    
    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item-summary mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between">
                    <div>
                        <h6 class="mb-1">${item.nombre}</h6>
                        <small class="text-muted">Cantidad: ${item.cantidad} x $${item.precio.toLocaleString('es-CL')}</small>
                    </div>
                    <div class="text-right">
                        <strong>$${itemTotal.toLocaleString('es-CL')}</strong>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Calcular envío y total
    const envio = subtotal > 50000 ? 0 : 3000;
    const total = subtotal + envio;
    
    html += `
        <div class="cart-totals mt-4">
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>$${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>${envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-CL')}`}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5 class="text-primary">$${total.toLocaleString('es-CL')}</h5>
            </div>
        </div>
    `;
    
    // Actualizar elementos del DOM
    if (cartSummary) cartSummary.innerHTML = html;
    if (orderSummary) orderSummary.innerHTML = html;
    
    // También actualizar elementos individuales si existen
    const subtotalElement = document.getElementById('checkoutSubtotal');
    const shippingElement = document.getElementById('checkoutShipping');
    const totalElement = document.getElementById('checkoutTotal');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toLocaleString('es-CL')}`;
    if (shippingElement) shippingElement.textContent = envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-CL')}`;
    if (totalElement) totalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    
    // Mostrar mensaje de envío gratis
    const shippingMessage = document.getElementById('shippingMessage');
    if (shippingMessage) {
        if (subtotal < 50000 && subtotal > 0) {
            const faltante = 50000 - subtotal;
            shippingMessage.innerHTML = `
                <i class="fas fa-shipping-fast mr-2"></i>
                <small>¡Faltan $${faltante.toLocaleString('es-CL')} para envío gratis!</small>
            `;
            shippingMessage.style.display = 'block';
        } else if (subtotal >= 50000) {
            shippingMessage.innerHTML = `
                <i class="fas fa-shipping-fast mr-2"></i>
                <small>¡Felicitaciones! Tienes envío gratis</small>
            `;
            shippingMessage.style.display = 'block';
        } else {
            shippingMessage.style.display = 'none';
        }
    }
}

// Mostrar carrito vacío
function showEmptyCart() {
    const cartSummary = document.getElementById('cartSummary');
    const orderSummary = document.getElementById('orderSummary');
    
    const emptyHtml = `
        <div class="text-center py-5">
            <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
            <h4>Tu carrito está vacío</h4>
            <p class="text-muted">Agrega productos al carrito antes de proceder al pago</p>
            <a href="tienda.html" class="btn btn-primary mt-3">
                <i class="fas fa-arrow-left mr-2"></i> Volver a la Tienda
            </a>
        </div>
    `;
    
    if (cartSummary) cartSummary.innerHTML = emptyHtml;
    if (orderSummary) orderSummary.innerHTML = emptyHtml;
}

// Inicializar formulario de pago
function initPaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    if (!paymentForm) return;
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar que el usuario esté autenticado
        if (typeof AuthManager !== 'undefined' && !AuthManager.isAuthenticated()) {
            alert('❌ Debes iniciar sesión para realizar el pago');
            AuthManager.requireAuth('checkout.html');
            return;
        }
        
        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const ciudad = document.getElementById('ciudad').value;
        const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
        
        // Validaciones básicas
        if (!nombre || !email || !telefono || !direccion || !ciudad || !metodoPago) {
            alert('❌ Por favor completa todos los campos requeridos');
            return;
        }
        
        // Obtener carrito
        const carritoData = localStorage.getItem('soulink_carrito');
        if (!carritoData) {
            alert('❌ No hay productos en el carrito');
            return;
        }
        
        const carrito = JSON.parse(carritoData);
        if (carrito.length === 0) {
            alert('❌ No hay productos en el carrito');
            return;
        }
        
        // Mostrar procesando
        const submitBtn = paymentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
        submitBtn.disabled = true;
        
        // Simular procesamiento de pago
        setTimeout(() => {
            // Aquí iría la lógica real de pago con API
            console.log('💳 Procesando pago para:', {
                nombre,
                email,
                telefono,
                direccion,
                ciudad,
                metodoPago: metodoPago.value,
                carrito
            });
            
            // Limpiar carrito después del pago exitoso
            localStorage.removeItem('soulink_carrito');
            localStorage.removeItem('soulink_checkout_carrito');
            
            // Redirigir a confirmación
            window.location.href = 'confirmacion-pago.html';
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initPaymentForm();
});

console.log('✅ checkout-auth.js cargado');
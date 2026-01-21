// ============================================
// SISTEMA DE AUTENTICACIÓN - SOULINK
// ============================================

const AuthManager = {
    // Claves de almacenamiento
    KEYS: {
        TOKEN: 'soulink_jwt_token',
        USER: 'soulink_user_data',
        CART: 'soulink_carrito',
        REDIRECT: 'soulink_redirect_url',
        PENDING_CART: 'soulink_pending_cart',
        CHECKOUT_REDIRECT: 'soulink_redirect_checkout'
    },

    // ===== VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO =====
isAuthenticated() {
    console.log('🔍 Verificando autenticación...');
    
    // 1. Verificar sistema nuevo con JWT
    const token = this.getToken();
    console.log('🔑 Token JWT encontrado:', token ? 'Sí' : 'No');
    
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isValid = payload.exp > Date.now() / 1000;
            console.log('✅ Token JWT válido:', isValid, 'Expira:', new Date(payload.exp * 1000));
            return isValid;
        } catch (error) {
            console.log('❌ Error al decodificar token JWT:', error);
        }
    }
    
    // 2. Verificar sistema antiguo (compatibilidad)
    const sesionActiva = localStorage.getItem('sesionActiva');
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    
    console.log('🔍 Sistema antiguo - Sesión activa:', sesionActiva);
    console.log('🔍 Sistema antiguo - Usuario:', usuarioActual);
    
    if (sesionActiva === 'true' && usuarioActual) {
        console.log('✅ Usuario autenticado (sistema antiguo)');
        return true;
    }
    
    console.log('❌ Usuario NO autenticado');
    return false;
},

    // ===== OBTENER TOKEN JWT =====
    getToken() {
        return localStorage.getItem(this.KEYS.TOKEN);
    },

    // ===== OBTENER DATOS DEL USUARIO =====
    getUser() {
        try {
            // Intentar obtener del sistema nuevo
            const userData = localStorage.getItem(this.KEYS.USER);
            if (userData) {
                return JSON.parse(userData);
            }
            
            // Fallback al sistema antiguo
            const usuarioAntiguo = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
            if (usuarioAntiguo) {
                return {
                    id: usuarioAntiguo.id,
                    nombre: usuarioAntiguo.nombre || usuarioAntiguo.nombre_completo,
                    email: usuarioAntiguo.email,
                    telefono: usuarioAntiguo.telefono || "",
                    rol: usuarioAntiguo.rol || "usuario",
                    loginSource: 'legacy'
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    },

    // ===== GUARDAR SESIÓN (después de login exitoso) =====
    saveSession(token, userData) {
        // Guardar en sistema nuevo
        localStorage.setItem(this.KEYS.TOKEN, token);
        localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
        
        // Mantener compatibilidad con sistema antiguo
        localStorage.setItem('sesionActiva', 'true');
        localStorage.setItem('usuarioActual', JSON.stringify(userData));
        
        console.log('✅ Sesión guardada en ambos sistemas');
    },

    // ===== CERRAR SESIÓN =====
    logout() {
        // Limpiar sistema nuevo
        localStorage.removeItem(this.KEYS.TOKEN);
        localStorage.removeItem(this.KEYS.USER);
        localStorage.removeItem(this.KEYS.PENDING_CART);
        localStorage.removeItem(this.KEYS.CHECKOUT_REDIRECT);
        localStorage.removeItem(this.KEYS.REDIRECT);
        
        // Limpiar sistema antiguo
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('usuarioActual');
        
        // Limpiar carrito
        localStorage.removeItem('soulink_carrito');
        localStorage.removeItem('soulink_checkout_carrito');
        
        console.log('✅ Sesión cerrada completamente');
        
        // Redirigir a login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    },

    // ===== REQUERIR AUTENTICACIÓN =====
    requireAuth(redirectUrl = null) {
        if (!this.isAuthenticated()) {
            console.log('🔒 Usuario no autenticado, redirigiendo a login...');
            
            // Guardar URL para redirigir después del login
            if (redirectUrl) {
                localStorage.setItem(this.KEYS.REDIRECT, redirectUrl);
                console.log('📍 URL guardada para redirección:', redirectUrl);
            }
            
            // Guardar carrito actual si estamos en carrito
            const currentPath = window.location.pathname;
            if (currentPath.includes('carrito.html')) {
                const cartData = localStorage.getItem('soulink_carrito');
                if (cartData) {
                    localStorage.setItem(this.KEYS.PENDING_CART, cartData);
                    localStorage.setItem(this.KEYS.CHECKOUT_REDIRECT, 'checkout.html');
                    console.log('🛒 Carrito guardado para después del login');
                }
            }
            
            // Redirigir a login
            window.location.href = 'login.html';
            return false;
        }
        
        console.log('✅ Usuario autenticado, acceso permitido');
        return true;
    },

    // ===== OBTENER URL DE REDIRECCIÓN DESPUÉS DEL LOGIN =====
    getRedirectUrl() {
        const checkoutRedirect = localStorage.getItem(this.KEYS.CHECKOUT_REDIRECT);
        const generalRedirect = localStorage.getItem(this.KEYS.REDIRECT);
        
        console.log('📍 URLs guardadas:', { checkoutRedirect, generalRedirect });
        
        // Priorizar checkout si había un carrito pendiente
        if (checkoutRedirect) {
            localStorage.removeItem(this.KEYS.CHECKOUT_REDIRECT);
            localStorage.removeItem(this.KEYS.REDIRECT);
            return checkoutRedirect;
        }
        
        if (generalRedirect) {
            localStorage.removeItem(this.KEYS.REDIRECT);
            localStorage.removeItem(this.KEYS.CHECKOUT_REDIRECT);
            return generalRedirect;
        }
        
        return '../index.html';
    },

    // ===== RESTAURAR CARRITO PENDIENTE (después del login) =====
    restorePendingCart() {
        const pendingCart = localStorage.getItem(this.KEYS.PENDING_CART);
        if (pendingCart) {
            console.log('🛒 Restaurando carrito pendiente...');
            localStorage.setItem('soulink_carrito', pendingCart);
            localStorage.removeItem(this.KEYS.PENDING_CART);
            return JSON.parse(pendingCart);
        }
        return null;
    },

    // ===== PROTEGER CHECKOUT =====
    protectCheckout() {
        console.log('🔐 Verificando acceso a checkout...');
        
        if (!this.isAuthenticated()) {
            console.log('🔒 Acceso denegado a checkout - Requiere autenticación');
            
            // Guardar carrito actual
            const cartData = localStorage.getItem('soulink_carrito');
            if (cartData) {
                localStorage.setItem(this.KEYS.PENDING_CART, cartData);
                console.log('🛒 Carrito guardado como pendiente');
            }
            
            // Marcar que queremos ir a checkout después del login
            localStorage.setItem(this.KEYS.CHECKOUT_REDIRECT, 'checkout.html');
            
            // Redirigir a login
            window.location.href = 'login.html';
            return false;
        }
        
        console.log('✅ Acceso a checkout permitido');
        
        // Si está autenticado, cargar datos del usuario
        const user = this.getUser();
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            // Prellenar formulario de checkout si existe
            this.prefillCheckoutForm(user);
        }
        
        return true;
    },

    // ===== PREFILL FORMULARIO DE CHECKOUT =====
    prefillCheckoutForm(user) {
        if (!user) return;
        
        console.log('📝 Prellenando formulario con datos de usuario');
        
        setTimeout(() => {
            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const telefonoInput = document.getElementById('telefono');
            
            if (nombreInput) {
                nombreInput.value = user.nombre || user.nombre_completo || '';
                console.log('✅ Nombre prellenado:', nombreInput.value);
            }
            
            if (emailInput) {
                emailInput.value = user.email || '';
                console.log('✅ Email prellenado:', emailInput.value);
            }
            
            if (telefonoInput && user.telefono) {
                telefonoInput.value = user.telefono;
                console.log('✅ Teléfono prellenado:', telefonoInput.value);
            }
        }, 500);
    },

    // ===== ACTUALIZAR NAVBAR CON ESTADO DE AUTENTICACIÓN =====
    updateNavbar() {
        const userMenuContainer = document.getElementById('userMenuContainer');
        const userMenuText = document.getElementById('userMenuText');
        
        if (!userMenuContainer || !userMenuText) {
            console.log('⚠️ No se encontró el menú de usuario en el navbar');
            return;
        }
        
        if (this.isAuthenticated()) {
            const user = this.getUser();
            if (user) {
                // Mostrar nombre del usuario
                const primerNombre = (user.nombre || user.nombre_completo || 'Usuario').split(' ')[0];
                userMenuText.innerHTML = `<i class="fas fa-user-circle mr-1"></i> ${primerNombre}`;
                userMenuText.classList.add('text-primary', 'font-weight-bold');
                
                // Actualizar dropdown
                const dropdown = userMenuContainer.querySelector('.dropdown-menu');
                if (dropdown) {
                    dropdown.innerHTML = `
                        <a class="dropdown-item" href="perfil.html">
                            <i class="fas fa-user"></i> Mi Perfil
                        </a>
                        <a class="dropdown-item" href="configuracion.html">
                            <i class="fas fa-cog"></i> Configuración
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onclick="AuthManager.logout(); return false;">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </a>
                    `;
                }
                
                console.log('✅ Navbar actualizado para usuario autenticado:', primerNombre);
            }
        } else {
            // Usuario no autenticado
            userMenuText.innerHTML = 'Iniciar Sesión';
            userMenuText.classList.remove('text-primary', 'font-weight-bold');
            
            const dropdown = userMenuContainer.querySelector('.dropdown-menu');
            if (dropdown) {
                dropdown.innerHTML = `
                    <a class="dropdown-item" href="login.html#login">
                        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                    </a>
                    <a class="dropdown-item" href="login.html#register">
                        <i class="fas fa-user-plus"></i> Crear Cuenta
                    </a>
                    <a class="dropdown-item" href="login.html#recover">
                        <i class="fas fa-key"></i> Recuperar Contraseña
                    </a>
                `;
            }
            
            console.log('✅ Navbar actualizado para usuario no autenticado');
        }
    },

    // ===== INICIALIZAR VERIFICACIÓN EN TODAS LAS PÁGINAS =====
    init() {
        console.log('🔐 Sistema de autenticación inicializado');
        
        // Verificar sesión en navbar
        this.updateNavbar();
        
        // Verificar si estamos en checkout y requerir autenticación
        if (window.location.pathname.includes('checkout.html')) {
            this.protectCheckout();
        }
        
        // Configurar logout global
        window.AuthManager = this;
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});

// Exportar para uso global
window.AuthManager = AuthManager;
console.log('✅ Módulo AuthManager cargado');
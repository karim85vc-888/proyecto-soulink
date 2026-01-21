// ============================================
// SOULINK - Sistema de Login Multimodo
// Soporta: Backend local, Producción y JSON fallback
// ============================================

// Nivel de depuración
const LOGIN_DEBUG = true;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', async function() {
    if (LOGIN_DEBUG) console.log("🚀 Login SOULINK - Sistema multimodo inicializado");
    
    // Mostrar modo detectado
    if (typeof getLoginStrategy === 'function') {
        const strategy = getLoginStrategy();
        console.log(`📊 Estrategia de login: ${strategy.description}`);
    }
    
    // Configurar componentes
    setupPasswordToggles();
    initLoginValidation();
    initRegisterValidation();
    initRecoverValidation();
    initTabHandling();
    initRealTimeValidation(); // Nueva función de validación en tiempo real
});

// ==================== FUNCIONES DE CONFIGURACIÓN ====================
function getBackendUrls() {
    // Usar config.js si está disponible
    if (typeof SoulinkConfig !== 'undefined' && SoulinkConfig.backendUrls) {
        return SoulinkConfig.backendUrls;
    }
    
    // Fallback hardcoded
    return {
        local: 'http://localhost:8080',
        production: 'https://proyecto-soulink.onrender.com'
    };
}

// ==================== TOGGLE PASSWORD ====================
function setupPasswordToggles() {
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            togglePasswordVisibility('loginPassword', this);
        });
    }
    
    const toggleRegPassword = document.getElementById('toggleRegPassword');
    if (toggleRegPassword) {
        toggleRegPassword.addEventListener('click', function() {
            togglePasswordVisibility('regPassword', this);
        });
    }
}

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const icon = button.querySelector('i');
    if (icon) {
        icon.className = type === 'text' ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
}

// ==================== VALIDACIONES BÁSICAS ====================
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Limpiar error anterior
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    input.classList.remove('is-invalid');
    
    if (message) {
        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message invalid-feedback d-block';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }
}

function validateEmail(input) {
    const email = input.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showError(input, 'El email es requerido');
        return false;
    }
    
    if (!regex.test(email)) {
        showError(input, 'Email inválido');
        return false;
    }
    
    showError(input, '');
    return true;
}

function validatePassword(input) {
    const password = input.value;
    
    if (!password) {
        showError(input, 'La contraseña es requerida');
        return false;
    }
    
    if (password.length < 8) {
        showError(input, 'Mínimo 8 caracteres');
        return false;
    }
    
    showError(input, '');
    return true;
}

// ==================== VALIDACIONES ADICIONALES ====================
function validateName(input) {
    const nombre = input.value.trim();
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    
    if (!nombre) {
        showError(input, 'Este campo es requerido');
        return false;
    }
    
    if (nombre.length < 2) {
        showError(input, 'Mínimo 2 caracteres');
        return false;
    }
    
    if (!regex.test(nombre)) {
        showError(input, 'Solo se permiten letras y espacios');
        return false;
    }
    
    showError(input, '');
    return true;
}

function validatePhone(input) {
    const telefono = input.value.trim();
    
    if (!telefono) {
        showError(input, 'El teléfono es requerido');
        return false;
    }
    
    // Eliminar espacios y caracteres especiales para contar dígitos
    const digitos = telefono.replace(/\D/g, '');
    
    if (digitos.length < 8) {
        showError(input, 'Mínimo 8 dígitos');
        return false;
    }
    
    if (digitos.length > 15) {
        showError(input, 'Máximo 15 dígitos');
        return false;
    }
    
    // Validar formato básico de teléfono
    const regex = /^[\d\s\+\-\(\)]+$/;
    if (!regex.test(telefono)) {
        showError(input, 'Formato inválido. Solo números, +, -, (, ) o espacios');
        return false;
    }
    
    showError(input, '');
    return true;
}

// ==================== VALIDACIÓN EN TIEMPO REAL ====================
function initRealTimeValidation() {
    // Validación de nombre en tiempo real
    const regNombre = document.getElementById('regNombre');
    if (regNombre) {
        regNombre.addEventListener('blur', () => validateName(regNombre));
        regNombre.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateName(this);
            }
        });
    }
    
    // Validación de apellido en tiempo real
    const regApellido = document.getElementById('regApellido');
    if (regApellido) {
        regApellido.addEventListener('blur', () => validateName(regApellido));
        regApellido.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateName(this);
            }
        });
    }
    
    // Validación de teléfono en tiempo real
    const regTelefono = document.getElementById('regTelefono');
    if (regTelefono) {
        regTelefono.addEventListener('blur', () => validatePhone(regTelefono));
        
        regTelefono.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validatePhone(this);
            }
        });

        // Formateo automático de teléfono
        regTelefono.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // solo números

            // Si empieza con 56, eliminamos para reinsertar
            if (value.startsWith('56')) {
                value = value.substring(2);
            }

            // Tomamos máximo 9 dígitos (celular chileno)
            value = value.substring(0, 9);

            // Formateo: +56 9 1234 5678
            let formatted = '+56';
            if (value.length > 0) formatted += ' ' + value.charAt(0); // primer dígito del celular
            if (value.length > 1) formatted += ' ' + value.substring(1, 5); // siguientes 4 dígitos
            if (value.length > 5) formatted += ' ' + value.substring(5, 9); // últimos 4 dígitos

            this.value = formatted;
        });
    }
    
    // Validación de email en tiempo real
    const regEmail = document.getElementById('regEmail');
    if (regEmail) {
        regEmail.addEventListener('blur', () => validateEmail(regEmail));
    }
    
    // Validación de contraseña en tiempo real
    const regPassword = document.getElementById('regPassword');
    if (regPassword) {
        regPassword.addEventListener('blur', () => validatePassword(regPassword));
    }
}

// ==================== BACKEND FUNCTIONS ====================
async function loginWithBackend(email, password, backendUrl) {
    try {
        if (LOGIN_DEBUG) console.log(`🌐 Intentando login en backend: ${backendUrl}`);
        
        const response = await fetch(`${backendUrl}/usuarios/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // DEBUG: Ver estructura real
            console.log("🔍 Respuesta backend RAW:", data);
            
            // El backend devuelve: {usuario: {...}, token: "..."}
            // Pero el frontend espera que 'usuario' tenga el token dentro
            
            let usuario;
            if (data.usuario && data.token) {
                // Backend nuevo: {usuario: {...}, token: "..."}
                usuario = {
                    id: data.usuario.id,
                    nombre: data.usuario.nombre,
                    email: data.usuario.email,
                    telefono: data.usuario.telefono,
                    token: data.token
                };
            } else {
                // Backend viejo o estructura diferente
                usuario = data;
            }
            
            return { success: true, usuario };
            
        } else {
            const errorText = await response.text();
            if (LOGIN_DEBUG) console.log(`❌ Backend error ${response.status}:`, errorText);
            return { 
                success: false, 
                error: response.status === 401 ? 'Credenciales incorrectas' : 'Error del servidor'
            };
        }
    } catch (error) {
        if (LOGIN_DEBUG) console.error(`❌ Error con backend ${backendUrl}:`, error);
        return { 
            success: false, 
            error: error.message.includes('Failed to fetch') ? 'Backend no disponible' : error.message
        };
    }
}

async function registerWithBackend(userData, backendUrl) {
    try {
        if (LOGIN_DEBUG) console.log(`🌐 Intentando registro en: ${backendUrl}`);
        
        const response = await fetch(`${backendUrl}/usuarios/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            const usuario = await response.json();
            return { success: true, usuario };
        } else {
            const error = await response.json().catch(() => ({ message: 'Error en registro' }));
            return { success: false, error: error.message };
        }
    } catch (error) {
        if (LOGIN_DEBUG) console.error(`❌ Error con backend ${backendUrl}:`, error);
        return { success: false, error: 'Backend no disponible' };
    }
}

// ==================== LOGIN CON JSON (FALLBACK) ====================
async function loginWithUsuariosJSON(email, password) {
    try {
        if (LOGIN_DEBUG) console.log('📄 Intentando login con usuarios.json...');
        
        // Cargar usuarios desde JSON
        const response = await fetch('../data/usuarios.json');
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar usuarios.json: ${response.status}`);
        }
        
        const usuarios = await response.json();
        
        // Buscar usuario por email
        const usuario = usuarios.find(u => u.email === email);
        
        if (!usuario) {
            if (LOGIN_DEBUG) console.log('❌ Usuario no encontrado en usuarios.json');
            return null;
        }
        
        // Decodificar la contraseña en Base64
        let contrasenaDecodificada;
        try {
            contrasenaDecodificada = atob(usuario.contrasena_codificada);
        } catch (e) {
            if (LOGIN_DEBUG) console.log('❌ Error decodificando contraseña');
            return null;
        }
        
        // Comparar contraseñas
        if (contrasenaDecodificada === password) {
            if (LOGIN_DEBUG) console.log('✅ Login exitoso con usuarios.json');
            return {
                id: usuario.id,
                nombre: usuario.nombre_completo,
                email: usuario.email,
                telefono: usuario.telefono || "",
                rol: usuario.rol || "usuario",
                avatar: usuario.avatar || ""
            };
        } else {
            if (LOGIN_DEBUG) console.log('❌ Contraseña incorrecta');
            return null;
        }
        
    } catch (error) {
        if (LOGIN_DEBUG) console.error("❌ Error en login con usuarios.json:", error);
        return null;
    }
}

// ==================== REGISTRO CON JSON (FALLBACK) ====================
async function registerWithJSON(userData) {
    try {
        if (LOGIN_DEBUG) console.log('📄 Registrando usuario localmente...');
        
        // Cargar usuarios existentes
        const response = await fetch('../data/usuarios.json');
        let usuarios = [];
        
        if (response.ok) {
            usuarios = await response.json();
        }
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            id: Date.now(),
            nombre_completo: userData.nombre,
            email: userData.email,
            telefono: userData.telefono || "",
            contrasena_codificada: btoa(userData.password),
            rol: "usuario",
            fecha_registro: new Date().toISOString().split('T')[0],
            avatar: ""
        };
        
        usuarios.push(nuevoUsuario);
        
        // Guardar en localStorage (simulado - en realidad no podemos modificar el JSON)
        localStorage.setItem('usuarios_locales', JSON.stringify(usuarios));
        
        if (LOGIN_DEBUG) console.log('✅ Usuario registrado localmente');
        return { success: true, usuario: nuevoUsuario };
        
    } catch (error) {
        if (LOGIN_DEBUG) console.error('❌ Error en registro local:', error);
        return { success: false, error: 'Error en registro local' };
    }
}

// ==================== LOGIN PRINCIPAL ====================
function initLoginValidation() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar campos
        if (!validateEmail(loginEmail) || !validatePassword(loginPassword)) {
            return;
        }

        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        // Deshabilitar botón y mostrar loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        submitBtn.disabled = true;

        try {
            let usuario = null;
            let fuente = '';
            let errorMessage = '';
            
            if (LOGIN_DEBUG) console.log('=== INICIANDO PROCESO DE LOGIN ===');
            if (LOGIN_DEBUG) console.log('Email:', email);
            
            // Obtener estrategia de login
            let strategy = { mode: 'json-only' };
            if (typeof getLoginStrategy === 'function') {
                strategy = getLoginStrategy();
                console.log('🎯 Estrategia de login:', strategy);
            }
            
            const BACKEND_URLS = getBackendUrls();
            
            // ESTRATEGIA 1: Backend (local o producción)
            if (strategy.mode !== 'json-only') {
                const backendUrl = strategy.backendUrl;
                
                console.log(`1. 🔄 Probando backend (${strategy.mode}) en: ${backendUrl}`);
                const result = await loginWithBackend(email, password, backendUrl);
                
                if (result.success) {
                    usuario = result.usuario;
                    fuente = `backend-${strategy.mode}`;
                    console.log(`✅ Login exitoso con backend ${strategy.mode}`);
                    console.log('📦 Datos usuario backend:', usuario);
                } else {
                    errorMessage = result.error;
                    console.log(`❌ Falló backend ${strategy.mode}:`, errorMessage);
                }
            }
            
            // ESTRATEGIA 2: JSON fallback
            if (!usuario) {
                console.log('2. 📄 Probando usuarios.json...');
                usuario = await loginWithUsuariosJSON(email, password);
                
                if (usuario) {
                    fuente = 'json-fallback';
                    console.log('✅ Login exitoso con usuarios.json');
                    console.log('📦 Datos usuario JSON:', usuario);
                } else {
                    console.log('❌ Falló usuarios.json');
                }
            }

            // RESULTADO FINAL
            if (usuario) {
                // 🔥 GUARDAR SESIÓN CON DEPURACIÓN
                const usuarioParaStorage = {
                    id: usuario.id,
                    nombre: usuario.nombre || usuario.nombre_completo,
                    email: usuario.email,
                    telefono: usuario.telefono || "",
                    rol: usuario.rol || "usuario",
                    avatar: usuario.avatar || "",
                    loginSource: fuente,
                    loginTime: new Date().toISOString(),
                    token: usuario.token || null  // Guardar token si existe
                };
                
                console.log('💾 Datos para guardar en sesión:', usuarioParaStorage);
                console.log('🔑 Token disponible:', usuario.token ? 'SÍ' : 'NO');
                
                // Usar AuthManager si está disponible
                if (typeof AuthManager !== 'undefined') {
                    console.log('🔐 AuthManager disponible, guardando sesión...');
                    
                    // Si hay token JWT, usar sistema nuevo
                    if (usuario.token) {
                        AuthManager.saveSession(usuario.token, usuarioParaStorage);
                        console.log('✅ Sesión guardada con AuthManager + JWT');
                    } else {
                        // Si no hay token, guardar solo datos de usuario
                        console.log('⚠️ No hay token JWT, guardando solo datos de usuario');
                        AuthManager.saveSession(null, usuarioParaStorage);
                    }
                } else {
                    console.log('⚠️ AuthManager NO disponible, usando sistema antiguo');
                    localStorage.setItem('usuarioActual', JSON.stringify(usuarioParaStorage));
                    localStorage.setItem('sesionActiva', 'true');
                    console.log('✅ Sesión guardada en sistema antiguo');
                }
                
                // 🔥 VERIFICAR QUE SE GUARDÓ CORRECTAMENTE
                setTimeout(() => {
                    console.log('🔍 VERIFICANDO ALMACENAMIENTO:');
                    console.log('- soulink_jwt_token:', localStorage.getItem('soulink_jwt_token') ? 'SÍ' : 'NO');
                    console.log('- soulink_user_data:', localStorage.getItem('soulink_user_data'));
                    console.log('- usuarioActual:', localStorage.getItem('usuarioActual'));
                    console.log('- sesionActiva:', localStorage.getItem('sesionActiva'));
                    
                    // Verificar autenticación
                    if (typeof AuthManager !== 'undefined') {
                        console.log('🔐 AuthManager.isAuthenticated():', AuthManager.isAuthenticated());
                    }
                }, 100);
                
                // 🔥 REDIRECCIÓN INTELIGENTE
                mostrarExitoLoginConRedireccion(usuarioParaStorage.nombre);
                
            } else {
                // Mostrar error
                const mensajeError = errorMessage || "Usuario o contraseña incorrectos";
                mostrarErrorLogin(`❌ ${mensajeError}`);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }

        } catch (error) {
            console.error("❌ Error crítico en proceso de login:", error);
            mostrarErrorLogin("❌ Error inesperado al iniciar sesión");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// 🔥 NUEVA FUNCIÓN: Mostrar éxito con redirección inteligente
function mostrarExitoLoginConRedireccion(nombreUsuario) {
    const loginForm = document.getElementById('loginForm');
    const cardBody = loginForm.closest('.card-body');

    cardBody.innerHTML = `
        <div class="login-success-container d-flex flex-column align-items-center justify-content-center py-5">
            <i class="fas fa-check-circle text-success mb-3" style="font-size:3.5rem"></i>
            <h4 class="mb-2 text-center">¡Bienvenido/a, ${nombreUsuario}!</h4>
            <p class="text-muted mb-4 text-center">Sesión iniciada correctamente</p>
            <div class="spinner-border text-primary mb-3" style="width:2.5rem;height:2.5rem"></div>
            <p class="mb-0 text-center"><strong>Redirigiendo...</strong></p>
        </div>
    `;

    // 🔥 LÓGICA DE REDIRECCIÓN INTELIGENTE
    setTimeout(() => {
        let redirectUrl = '../index.html'; // Por defecto
        
        // Verificar si hay carrito pendiente
        const pendingCart = localStorage.getItem('soulink_pending_cart');
        const redirectToCheckout = localStorage.getItem('soulink_redirect_checkout');
        
        if (pendingCart && redirectToCheckout) {
            // Restaurar carrito pendiente
            localStorage.setItem('soulink_carrito', pendingCart);
            localStorage.removeItem('soulink_pending_cart');
            localStorage.removeItem('soulink_redirect_checkout');
            
            // Redirigir a checkout
            redirectUrl = 'checkout.html';
            console.log('🛒 Carrito restaurado, redirigiendo a checkout...');
        } else if (typeof AuthManager !== 'undefined') {
            // Usar AuthManager para obtener URL de redirección
            redirectUrl = AuthManager.getRedirectUrl();
        }
        
        console.log('📍 Redirigiendo a:', redirectUrl);
        window.location.href = redirectUrl;
    }, 2000);
}

// ==================== REGISTRO ====================
function initRegisterValidation() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    const regNombre = document.getElementById('regNombre');
    const regApellido = document.getElementById('regApellido');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const regTelefono = document.getElementById('regTelefono');
    const acceptTerms = document.getElementById('acceptTerms');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validaciones mejoradas con funciones específicas
        if (!validateName(regNombre) || !validateName(regApellido)) return;
        if (!validateEmail(regEmail)) return;
        if (!validatePassword(regPassword)) return;
        if (!validatePhone(regTelefono)) return;
        
        if (regPassword.value !== regConfirmPassword.value) {
            showError(regConfirmPassword, "Las contraseñas no coinciden");
            return;
        }
        
        if (!acceptTerms.checked) {
            alert("❌ Debes aceptar los términos y condiciones");
            acceptTerms.classList.add('is-invalid');
            acceptTerms.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const nombreCompleto = `${regNombre.value.trim()} ${regApellido.value.trim()}`;
        const email = regEmail.value.trim();
        const password = regPassword.value;
        const telefono = regTelefono.value.trim();

        // Deshabilitar botón
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
        submitBtn.disabled = true;

        try {
            let resultado = null;
            let fuente = '';
            
            // Datos del usuario
            const userData = {
                nombre: nombreCompleto,
                email: email,
                password: password,
                telefono: telefono,
                id_rol: 2 // Usuario normal
            };
            
            if (LOGIN_DEBUG) console.log('=== INICIANDO PROCESO DE REGISTRO ===');
            
            // Obtener estrategia
            let strategy = { mode: 'json-only' };
            if (typeof getLoginStrategy === 'function') {
                strategy = getLoginStrategy();
            }
            
            const BACKEND_URLS = getBackendUrls();
            
            // ESTRATEGIA 1: Backend
            if (strategy.mode !== 'json-only') {
                const backendUrl = strategy.backendUrl;
                
                if (LOGIN_DEBUG) console.log(`1. Probando registro en backend (${strategy.mode})...`);
                resultado = await registerWithBackend(userData, backendUrl);
                
                if (resultado.success) {
                    fuente = `backend-${strategy.mode}`;
                    if (LOGIN_DEBUG) console.log(`✅ Registro exitoso en backend ${strategy.mode}`);
                } else {
                    if (LOGIN_DEBUG) console.log(`❌ Falló registro en backend ${strategy.mode}:`, resultado.error);
                }
            }
            
            // ESTRATEGIA 2: JSON/localStorage
            if (!resultado || !resultado.success) {
                if (LOGIN_DEBUG) console.log('2. Registrando localmente...');
                resultado = await registerWithJSON(userData);
                
                if (resultado.success) {
                    fuente = 'local-fallback';
                    if (LOGIN_DEBUG) console.log('✅ Registro exitoso localmente');
                } else {
                    if (LOGIN_DEBUG) console.log('❌ Falló registro local:', resultado.error);
                }
            }

            // RESULTADO FINAL
            if (resultado && resultado.success) {
                // Guardar sesión automáticamente
                const usuarioCreado = resultado.usuario;
                const usuarioParaStorage = {
                    id: usuarioCreado.id,
                    nombre: usuarioCreado.nombre || usuarioCreado.nombre_completo,
                    email: usuarioCreado.email,
                    telefono: usuarioCreado.telefono || telefono,
                    rol: usuarioCreado.rol || "usuario",
                    registerSource: fuente,
                    registerTime: new Date().toISOString()
                };
                
                // Usar AuthManager si está disponible
                if (typeof AuthManager !== 'undefined') {
                    AuthManager.saveSession(null, usuarioParaStorage); // Sin token para registro local
                } else {
                    localStorage.setItem('usuarioActual', JSON.stringify(usuarioParaStorage));
                    localStorage.setItem('sesionActiva', 'true');
                }
                
                // Mostrar mensaje de éxito
                alert(`✅ ¡Registro exitoso! Bienvenido/a ${usuarioParaStorage.nombre}`);
                
                // Cambiar a pestaña de login
                document.getElementById('loginEmail').value = email;
                document.querySelector('#login-tab').click();
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    let redirectUrl = '../index.html';
                    if (typeof AuthManager !== 'undefined') {
                        redirectUrl = AuthManager.getRedirectUrl();
                    }
                    window.location.href = redirectUrl;
                }, 2000);
                
            } else {
                alert(`❌ Error al registrar: ${resultado ? resultado.error : 'Error desconocido'}`);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }

        } catch (error) {
            if (LOGIN_DEBUG) console.error("❌ Error crítico en registro:", error);
            alert("❌ Error inesperado al registrar");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==================== RECUPERAR CONTRASEÑA ====================
function initRecoverValidation() {
    const recoverForm = document.getElementById('recoverForm');
    if (!recoverForm) return;
    
    const recoverEmail = document.getElementById('recoverEmail');
    const recoverSuccess = document.getElementById('recoverSuccess');

    recoverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateEmail(recoverEmail)) return;
        
        const email = recoverEmail.value.trim();
        
        // Simular envío
        if (LOGIN_DEBUG) console.log(`📧 Enviando recuperación a: ${email}`);
        
        // Mostrar éxito (simulado)
        recoverSuccess.style.display = 'block';
        recoverForm.reset();
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            recoverSuccess.style.display = 'none';
        }, 5000);
    });
}

// ==================== UTILIDADES ====================
function initTabHandling() {
    const authTabs = document.querySelectorAll('a[data-toggle="tab"]');
    authTabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const target = e.target.getAttribute('href');
            clearFormValidation(target.substring(1) + 'Form');
        });
    });
}

function clearFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.querySelectorAll('.is-invalid').forEach(i => i.classList.remove('is-invalid'));
    form.querySelectorAll('.error-message').forEach(e => e.remove());
}

function mostrarErrorLogin(mensaje) {
    // Eliminar errores previos
    const erroresPrevios = document.querySelectorAll('.error-login-task10');
    erroresPrevios.forEach(e => e.remove());

    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger error-login-task10 mt-3';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i> ${mensaje}`;
    loginForm.appendChild(errorDiv);
    
    // Animación de shake
    loginForm.classList.add('login-error');
    setTimeout(() => loginForm.classList.remove('login-error'), 500);
}

// Reemplazar la función mostrarExitoLogin antigua
function mostrarExitoLogin(nombreUsuario) {
    mostrarExitoLoginConRedireccion(nombreUsuario);
}

// ==================== EXPORTAR FUNCIONES ÚTILES ====================
window.loginWithBackend = loginWithBackend;
window.loginWithUsuariosJSON = loginWithUsuariosJSON;
window.getBackendUrls = getBackendUrls;

if (LOGIN_DEBUG) console.log("✅ login.js cargado correctamente");
// ============================================
// SOULINK - Sistema de Login para GitHub Pages
// Versión optimizada para despliegue estático
// Solo soporta: JSON y localStorage
// ============================================

// Configuración específica para GitHub Pages
const GITHUB_PAGES_MODE = true;
const LOGIN_DEBUG = false;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 SOULINK Login - Modo GitHub Pages");
    
    // Configurar componentes
    setupPasswordToggles();
    initLoginValidation();
    initRegisterValidation();
    initRecoverValidation();
    initTabHandling();
    initRealTimeValidation(); // Nueva: validación en tiempo real
    
    // Cargar usuarios demo automáticamente
    loadDemoCredentials();
});

// ==================== CARGAR CREDENCIALES DEMO ====================
function loadDemoCredentials() {
    if (!GITHUB_PAGES_MODE) return;
    
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    if (loginEmail && loginEmail.value === '') {
        loginEmail.value = 'demo@soulink.org';
    }
    
    if (loginPassword && loginPassword.value === '') {
        loginPassword.value = 'demo1234';
    }
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
        regTelefono.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                // Formato chileno: +56 9 1234 5678
                if (value.startsWith('56') && value.length > 2) {
                    value = '+56 ' + value.substring(2);
                }
                if (value.length > 3) {
                    value = value.substring(0, 3) + ' ' + value.substring(3);
                }
                if (value.length > 7) {
                    value = value.substring(0, 7) + ' ' + value.substring(7);
                }
                if (value.length > 12) {
                    value = value.substring(0, 12);
                }
            }
            this.value = value;
        });
    }
}

// ==================== LOGIN CON JSON ====================
async function loginWithUsuariosJSON(email, password) {
    try {
        console.log('📄 Intentando login con usuarios.json...');
        
        // Cargar usuarios desde JSON
        const response = await fetch('../data/usuarios.json');
        
        if (!response.ok) {
            throw new Error('No se pudo cargar usuarios.json');
        }
        
        const usuarios = await response.json();
        
        // Buscar usuario por email
        const usuario = usuarios.find(u => u.email === email);
        
        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return null;
        }
        
        // Decodificar la contraseña en Base64
        let contrasenaDecodificada;
        try {
            contrasenaDecodificada = atob(usuario.contrasena_codificada);
        } catch (e) {
            console.log('❌ Error decodificando contraseña');
            return null;
        }
        
        // Comparar contraseñas
        if (contrasenaDecodificada === password) {
            console.log('✅ Login exitoso');
            return {
                id: usuario.id,
                nombre: usuario.nombre_completo,
                email: usuario.email,
                telefono: usuario.telefono || "",
                rol: usuario.rol || "usuario",
                avatar: usuario.avatar || ""
            };
        } else {
            console.log('❌ Contraseña incorrecta');
            return null;
        }
        
    } catch (error) {
        console.error("❌ Error en login con usuarios.json:", error);
        return null;
    }
}

// ==================== LOGIN CON LOCALSTORAGE ====================
function loginWithLocalStorage(email, password) {
    try {
        console.log('💾 Intentando login con localStorage...');
        
        // Cargar usuarios registrados localmente
        const usuariosLocales = JSON.parse(localStorage.getItem('usuarios_locales') || '[]');
        
        // Buscar usuario
        const usuario = usuariosLocales.find(u => u.email === email);
        
        if (!usuario) {
            return null;
        }
        
        // Decodificar contraseña Base64
        try {
            const contrasenaDecodificada = atob(usuario.contrasena_codificada);
            
            if (contrasenaDecodificada === password) {
                console.log('✅ Login exitoso con localStorage');
                return {
                    id: usuario.id,
                    nombre: usuario.nombre_completo,
                    email: usuario.email,
                    telefono: usuario.telefono || "",
                    rol: usuario.rol || "usuario"
                };
            }
        } catch (e) {
            console.log('❌ Error decodificando contraseña');
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Error en login localStorage:', error);
        return null;
    }
}

// ==================== LOGIN PRINCIPAL ====================
function initLoginValidation() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validación básica
        if (!email || !password) {
            mostrarErrorLogin("❌ Email y contraseña son requeridos");
            return;
        }

        // Validar email
        if (!validateEmail(document.getElementById('loginEmail'))) {
            return;
        }

        // Deshabilitar botón y mostrar loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        submitBtn.disabled = true;

        try {
            let usuario = null;
            let fuente = '';
            
            console.log('=== INICIANDO LOGIN (GitHub Pages) ===');
            
            // ESTRATEGIA 1: usuarios.json
            console.log('1. Probando usuarios.json...');
            usuario = await loginWithUsuariosJSON(email, password);
            
            if (usuario) {
                fuente = 'json-file';
                console.log('✅ Login exitoso con usuarios.json');
            } else {
                // ESTRATEGIA 2: localStorage (usuarios registrados localmente)
                console.log('2. Probando localStorage...');
                usuario = loginWithLocalStorage(email, password);
                
                if (usuario) {
                    fuente = 'localstorage';
                    console.log('✅ Login exitoso con localStorage');
                }
            }

            // RESULTADO FINAL
            if (usuario) {
                // Guardar sesión
                const usuarioParaStorage = {
                    id: usuario.id,
                    nombre: usuario.nombre || usuario.nombre_completo,
                    email: usuario.email,
                    telefono: usuario.telefono || "",
                    rol: usuario.rol || "usuario",
                    avatar: usuario.avatar || "",
                    loginSource: fuente,
                    loginTime: new Date().toISOString(),
                    githubPages: true
                };
                
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioParaStorage));
                localStorage.setItem('sesionActiva', 'true');
                
                console.log('💾 Sesión guardada en GitHub Pages');
                
                // Mostrar éxito
                mostrarExitoLogin(usuarioParaStorage.nombre);
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
                
            } else {
                // Mostrar error
                mostrarErrorLogin("❌ Usuario o contraseña incorrectos");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }

        } catch (error) {
            console.error("❌ Error crítico en login:", error);
            mostrarErrorLogin("❌ Error inesperado al iniciar sesión");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==================== REGISTRO LOCAL ====================
function initRegisterValidation() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener elementos
        const regNombre = document.getElementById('regNombre');
        const regApellido = document.getElementById('regApellido');
        const regEmail = document.getElementById('regEmail');
        const regPassword = document.getElementById('regPassword');
        const regConfirmPassword = document.getElementById('regConfirmPassword');
        const regTelefono = document.getElementById('regTelefono');
        const acceptTerms = document.getElementById('acceptTerms');
        
        // Validaciones mejoradas
        if (!validateName(regNombre) || !validateName(regApellido)) return;
        if (!validateEmail(regEmail)) return;
        if (!validatePassword(regPassword)) return;
        if (!validatePhone(regTelefono)) return;
        
        if (regPassword.value !== regConfirmPassword.value) {
            alert("❌ Las contraseñas no coinciden");
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
            console.log('=== REGISTRO LOCAL EN GITHUB PAGES ===');
            
            // Cargar usuarios existentes
            const usuariosLocales = JSON.parse(localStorage.getItem('usuarios_locales') || '[]');
            
            // Verificar si el email ya existe
            const emailExiste = usuariosLocales.some(u => u.email === email);
            
            if (emailExiste) {
                alert("❌ Este email ya está registrado");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Crear nuevo usuario
            const nuevoUsuario = {
                id: Date.now(),
                nombre_completo: nombreCompleto,
                email: email,
                telefono: telefono || "",
                contrasena_codificada: btoa(password), // Base64
                rol: "usuario",
                fecha_registro: new Date().toISOString().split('T')[0],
                avatar: "",
                registro_local: true,
                github_pages: true
            };
            
            // Agregar a la lista
            usuariosLocales.push(nuevoUsuario);
            
            // Guardar en localStorage
            localStorage.setItem('usuarios_locales', JSON.stringify(usuariosLocales));
            
            console.log('✅ Usuario registrado localmente:', nuevoUsuario);
            
            // Guardar sesión automáticamente
            const usuarioParaStorage = {
                id: nuevoUsuario.id,
                nombre: nombreCompleto,
                email: email,
                telefono: telefono || "",
                rol: "usuario",
                registerSource: 'localstorage',
                registerTime: new Date().toISOString(),
                githubPages: true
            };
            
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioParaStorage));
            localStorage.setItem('sesionActiva', 'true');
            
            // Mostrar mensaje de éxito
            alert(`✅ ¡Registro exitoso! Bienvenido/a ${nombreCompleto}`);
            
            // Cambiar a pestaña de login
            document.getElementById('loginEmail').value = email;
            document.querySelector('#login-tab').click();
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            
        } catch (error) {
            console.error("❌ Error en registro:", error);
            alert("❌ Error al registrar el usuario");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==================== RECUPERAR CONTRASEÑA ====================
function initRecoverValidation() {
    const recoverForm = document.getElementById('recoverForm');
    if (!recoverForm) return;
    
    const recoverSuccess = document.getElementById('recoverSuccess');

    recoverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('recoverEmail');
        const email = emailInput.value.trim();
        
        // Validar email
        if (!validateEmail(emailInput)) {
            return;
        }
        
        // Simular envío (en GitHub Pages no hay backend)
        console.log(`📧 Simulando recuperación para: ${email}`);
        
        // Mostrar mensaje de éxito simulado
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

function mostrarExitoLogin(nombreUsuario) {
    const loginForm = document.getElementById('loginForm');
    const cardBody = loginForm.closest('.card-body');

    cardBody.innerHTML = `
        <div class="login-success-container d-flex flex-column align-items-center justify-content-center py-5">
            <i class="fas fa-check-circle text-success mb-3" style="font-size:3.5rem"></i>
            <h4 class="mb-2 text-center">¡Bienvenido/a, ${nombreUsuario}!</h4>
            <p class="text-muted mb-4 text-center">Sesión iniciada correctamente en GitHub Pages</p>
            <div class="spinner-border text-primary mb-3" style="width:2.5rem;height:2.5rem"></div>
            <p class="mb-0 text-center"><strong>Redirigiendo al inicio...</strong></p>
            <a href="../index.html" class="btn btn-primary btn-sm mt-3">
                <i class="fas fa-home"></i> Ir al inicio ahora
            </a>
        </div>
    `;
}

// ==================== EXPORTAR FUNCIONES ====================
window.loginWithUsuariosJSON = loginWithUsuariosJSON;
window.loginWithLocalStorage = loginWithLocalStorage;

console.log("✅ login.js cargado para GitHub Pages");
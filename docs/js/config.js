// ============================
// CONFIGURACIÓN SOULINK - PARA GITHUB PAGES
// Versión específica para despliegue en GitHub Pages
// ============================

const SoulinkConfig = {
    // MODO FIJO PARA GITHUB PAGES: Solo JSON
    mode: 'json-only',
    
    // URLs del BACKEND (informativas, no funcionales en GitHub)
    backendUrls: {
        local: 'http://localhost:8080',
        production: 'https://api.soulink.org' // Tu dominio futuro
    },
    
    // Rutas de la API (solo referencia)
    apiEndpoints: {
        login: '/usuarios/login',
        register: '/usuarios/register',
        getUser: '/usuarios/{id}'
    },
    
    // Configuración específica para GitHub Pages
    githubPages: true,
    fallbackToJSON: true,
    debug: false, // Desactivar logs en producción
    
    // Usuarios demo predefinidos
    demoUsers: [
        {
            email: "demo@soulink.org",
            password: "demo1234", // Base64: ZGVtbzEyMzQ=
            nombre_completo: "Usuario Demo"
        },
        {
            email: "admin@soulink.org",
            password: "admin1234", // Base64: YWRtaW4xMjM0
            nombre_completo: "Administrador Demo",
            rol: "admin"
        }
    ]
};

// ============================
// DETECCIÓN DE ENTORNO GITHUB PAGES
// ============================

function detectMode() {
    // Forzar modo JSON-only en GitHub Pages
    updateLoginModeBadge('ghpages', 'GitHub Pages (Solo JSON)');
    return 'json-only';
}

// Actualizar el badge que muestra el modo de login
function updateLoginModeBadge(mode, text) {
    const badge = document.getElementById('loginModeBadge');
    if (!badge) return;
    
    const modeTexts = {
        'ghpages': '🌐 GitHub Pages - Modo Demo',
        'demo': '🖥️ Modo Demo Local'
    };
    
    badge.innerHTML = `<i class="fas fa-cloud mr-1"></i> ${modeTexts[mode] || text}`;
    badge.className = `login-mode-badge ${mode}`;
}

// ============================
// FUNCIONES DE URL (SIMULADAS)
// ============================

function getBackendUrl() {
    return null; // No hay backend en GitHub Pages
}

function getApiUrl(endpoint) {
    return null; // No hay API en GitHub Pages
}

// ============================
// ESTRATEGIA DE LOGIN PARA GITHUB PAGES
// ============================

function getLoginStrategy() {
    return {
        mode: 'json-only',
        backendUrl: null,
        useJSON: true,
        description: 'GitHub Pages: Solo login con usuarios.json',
        note: 'Para backend completo, ejecuta localmente con Spring Boot'
    };
}

// ============================
// VERIFICACIÓN DE DISPONIBILIDAD
// ============================

function checkBackendAvailability() {
    return Promise.resolve(false); // Siempre false en GitHub Pages
}

// ============================
// FUNCIONES DE AYUDA ESPECÍFICAS
// ============================

function getBackendUrls() {
    return SoulinkConfig.backendUrls;
}

function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

// ============================
// INICIALIZACIÓN PARA GITHUB PAGES
// ============================

function initGitHubPagesMode() {
    console.log('🚀 SOULINK configurado para GitHub Pages');
    console.log('📄 Modo: JSON-only (sin backend)');
    console.log('👤 Usuarios demo disponibles');
    
    // Mostrar información útil en consola
    if (SoulinkConfig.debug) {
        SoulinkConfig.demoUsers.forEach(user => {
            console.log(`👤 Demo: ${user.email} / ${user.password}`);
        });
    }
    
    return {
        mode: 'json-only',
        platform: 'github-pages',
        features: ['login-json', 'register-localstorage', 'no-backend']
    };
}

// ============================
// EXPORTAR
// ============================

window.SoulinkConfig = SoulinkConfig;
window.getBackendUrl = getBackendUrl;
window.getApiUrl = getApiUrl;
window.detectMode = detectMode;
window.getLoginStrategy = getLoginStrategy;
window.getBackendUrls = getBackendUrls;
window.isGitHubPages = isGitHubPages;
window.initGitHubPagesMode = initGitHubPagesMode;

// Inicializar automáticamente para GitHub Pages
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        detectMode();
        initGitHubPagesMode();
    });
} else {
    detectMode();
    initGitHubPagesMode();
}

console.log('✅ SOULINK Config cargado para GitHub Pages');
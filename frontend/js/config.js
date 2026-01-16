// ============================
// CONFIGURACIÓN SOULINK - Login
// ============================

const SoulinkConfig = {
    // MODO DE OPERACIÓN:
    // 'local' = localhost:8080 (desarrollo)
    // 'production' = servidor real (producción)
    // 'json-only' = solo usuarios.json (GitHub Pages)
    mode: 'local',
    
    // URLs del BACKEND - ¡CAMBIAR LA PRODUCCIÓN POR TU DOMINIO REAL!
    backendUrls: {
        local: 'http://localhost:8080',
        production: 'https://api.soulink.org'
    },
    
    // Rutas de la API
    apiEndpoints: {
        login: '/api/usuarios/login',
        register: '/api/usuarios/register',
        getUser: '/api/usuarios/{id}'
    },
    
    // Configuración de fallback
    fallbackToJSON: true,
    debug: true,
    
    // Usuarios demo para JSON-only mode
    demoUsers: [
        {
            email: "usuario@demo.com",
            password: "demo1234",
            nombre_completo: "Usuario Demo"
        }
    ]
};

// ============================
// DETECCIÓN AUTOMÁTICA DE MODO
// ============================

function detectMode() {
    // SIEMPRE local cuando estás en localhost
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168.')) {
        
        if (SoulinkConfig.debug) console.log('🔍 Modo forzado: Localhost');
        updateLoginModeBadge('local', 'Modo: Backend Local (:8080)');
        return 'local';
    }
    
    // GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        if (SoulinkConfig.debug) console.log('🔍 Modo GitHub Pages -> JSON-only');
        updateLoginModeBadge('json', 'Modo: Solo JSON');
        return 'json-only';
    }
    
    // Por defecto producción
    if (SoulinkConfig.debug) console.log('🔍 Modo: Producción');
    updateLoginModeBadge('production', 'Modo: Producción');
    return 'production';
}

// Verificar si el backend está disponible - SIMPLIFICADO
async function checkBackendAvailability() {
    return true;
}

// Actualizar el badge que muestra el modo de login
function updateLoginModeBadge(mode, text) {
    const badge = document.getElementById('loginModeBadge');
    if (!badge) return;
    
    const modeTexts = {
        'local': '🖥️ Backend Local',
        'production': '🌐 Backend Producción',
        'json': '📄 Solo JSON'
    };
    
    const modeColors = {
        'local': 'local',
        'production': 'production',
        'json': 'json'
    };
    
    badge.innerHTML = `<i class="fas fa-circle mr-1"></i> ${modeTexts[mode] || text}`;
    badge.className = `login-mode-badge ${modeColors[mode] || ''}`;
}

// ============================
// FUNCIONES DE URL
// ============================

function getBackendUrl() {
    const mode = SoulinkConfig.mode;
    
    switch(mode) {
        case 'local':
            return SoulinkConfig.backendUrls.local;
        case 'production':
            return SoulinkConfig.backendUrls.production;
        case 'json-only':
            return null;
        default:
            return SoulinkConfig.backendUrls.local;
    }
}

function getApiUrl(endpoint) {
    const baseUrl = getBackendUrl();
    if (!baseUrl) return null;
    
    return baseUrl + SoulinkConfig.apiEndpoints[endpoint];
}

// ============================
// FUNCIONES DE AYUDA PARA LOGIN
// ============================

function getLoginStrategy() {
    const mode = SoulinkConfig.mode;
    
    return {
        mode: mode,
        backendUrl: mode === 'json-only' ? null : getBackendUrl(),
        useJSON: mode === 'json-only',
        description: `Login usando: ${mode === 'json-only' ? 'usuarios.json' : mode + ' backend'}`
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
window.checkBackendAvailability = checkBackendAvailability;

// Detectar modo automáticamente al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectMode);
} else {
    detectMode();
}
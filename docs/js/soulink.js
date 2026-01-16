// ============================================
// SOULINK - JavaScript Unificado
// Archivo único con todas las funcionalidades
// ============================================

'use strict';

// Configuración global
const SoulinkConfig = {
    appName: 'SOULINK',
    version: '1.0.0',
    storagePrefix: 'soulink_',
    debug: true
};

// ===== 0. FUNCIÓN PARA MANEJAR RUTAS RELATIVAS =====
function obtenerRuta(archivo) {
    const path = window.location.pathname;
    console.log("📍 Ruta actual:", path);

    const esIndex = path.endsWith('/index.html') || path.endsWith('/') || path === '' || path === '/';
    const estaEnPages = path.includes('/pages/');

    let ruta = archivo;

    if (esIndex || !estaEnPages) {
        ruta = `pages/${archivo}`;
        console.log(`🔗 Desde raíz: ${archivo} → ${ruta}`);
    } else {
        console.log(`🔗 Desde pages/: ${archivo} → ${archivo}`);
    }

    return ruta;
}

// ===== 1. FUNCIONES DE SESIÓN =====
function verificarSesionEnNavbar() {
    const userMenuContainer = document.getElementById('userMenuContainer');
    const userMenuText = document.getElementById('userMenuText');
    const userDropdown = userMenuContainer ? userMenuContainer.querySelector('.dropdown-menu') : null;

    if (!userMenuContainer || !userMenuText) return;

    const sesionActiva = localStorage.getItem('sesionActiva');
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');

    if (sesionActiva === 'true' && usuarioActual) {
        const primerNombre = usuarioActual.nombre.split(' ')[0];
        userMenuText.innerHTML = `<i class="fas fa-user-circle mr-1"></i>${primerNombre}`;

        if (userDropdown) {
            userDropdown.innerHTML = `
                <a class="dropdown-item" href="${obtenerRuta('perfil.html')}"><i class="fas fa-user"></i> Mi Perfil</a>
                <a class="dropdown-item" href="${obtenerRuta('configuracion.html')}"><i class="fas fa-cog"></i> Configuración</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onclick="cerrarSesionGlobal()"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
            `;
        }

        userMenuContainer.classList.add('user-logged-in');
        userMenuText.classList.add('text-primary', 'font-weight-bold');
    } else {
        userMenuText.innerHTML = 'Iniciar Sesión';
        userMenuText.classList.remove('text-primary', 'font-weight-bold');
        if (userDropdown) {
            userDropdown.innerHTML = `
                <a class="dropdown-item" href="${obtenerRuta('login.html')}#login"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</a>
                <a class="dropdown-item" href="${obtenerRuta('login.html')}#register"><i class="fas fa-user-plus"></i> Crear Cuenta</a>
                <a class="dropdown-item" href="${obtenerRuta('login.html')}#recover"><i class="fas fa-key"></i> Recuperar Contraseña</a>
            `;
        }
    }
}

function cerrarSesionGlobal() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuarioActual');
    alert('✅ Sesión cerrada correctamente');
    const path = window.location.pathname;
    const estaEnPages = path.includes('/pages/');
    setTimeout(() => {
        window.location.href = estaEnPages ? '../index.html' : 'index.html';
    }, 500);
    return false;
}

// ===== 2. UTILIDADES BÁSICAS =====
const SoulinkUtils = {
    log: function(message, data = null) {
        if (SoulinkConfig.debug) console.log(`[${SoulinkConfig.appName}] ${message}`, data || '');
    },
    save: function(key, data) {
        try {
            localStorage.setItem(SoulinkConfig.storagePrefix + key, JSON.stringify(data));
            return true;
        } catch (e) {
            this.log('Error guardando datos:', e);
            return false;
        }
    },
    load: function(key) {
        try {
            const data = localStorage.getItem(SoulinkConfig.storagePrefix + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            this.log('Error cargando datos:', e);
            return null;
        }
    },
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} soulink-notification`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
            animation: soulinkFadeIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        const icons = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        notification.innerHTML = `<button type="button" class="close" onclick="this.parentElement.remove()"><span>&times;</span></button>
            <i class="fas ${icons[type] || 'fa-info-circle'} mr-2"></i>${message}`;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'soulinkFadeOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        if (!document.querySelector('#soulink-styles')) {
            const style = document.createElement('style');
            style.id = 'soulink-styles';
            style.textContent = `
                @keyframes soulinkFadeIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
                @keyframes soulinkFadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
                .soulink-notification { font-size:14px; padding:12px 15px; border-radius:8px; border-left:4px solid; }
                .soulink-notification.alert-success { border-left-color:#28a745; }
                .soulink-notification.alert-danger { border-left-color:#dc3545; }
                .soulink-notification.alert-warning { border-left-color:#ffc107; }
                .soulink-notification.alert-info { border-left-color:#17a2b8; }
            `;
            document.head.appendChild(style);
        }
    }
};

// ===== 3. FUNCIONALIDADES GLOBALES =====
const SoulinkCore = {
    init: function() {
        SoulinkUtils.log('Inicializando aplicación');
        verificarSesionEnNavbar();
        if (typeof configurarElementosAdmin === 'function') configurarElementosAdmin();
        this.trackVisits();
        this.createBackToTop();
        this.enhanceNavigation();
        this.enhanceForms();
        this.enhanceCards();
        this.initPageSpecificFeatures();
    },
    trackVisits: function() {
        let visits = this.load('visits') || 0;
        visits++;
        this.save('visits', visits);
        const visitElement = document.getElementById('visitCounter');
        if (visitElement) visitElement.textContent = `Visitas: ${visits}`;
        SoulinkUtils.log(`Visita número: ${visits}`);
    },
    createBackToTop: function() {
        const btn = document.createElement('button');
        btn.id = 'soulink-back-to-top';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        btn.title = 'Volver arriba';
        btn.style.cssText = 'position: fixed; bottom:30px; right:30px; width:50px; height:50px; background:var(--primary-color,#8C52FF); color:white; border:none; border-radius:50%; font-size:20px; cursor:pointer; opacity:0; transition:opacity 0.3s, transform 0.3s; z-index:999; box-shadow:0 4px 12px rgba(0,0,0,0.2);';
        document.body.appendChild(btn);
        window.addEventListener('scroll', () => {
            btn.style.opacity = window.scrollY > 300 ? '1' : '0';
            btn.style.transform = window.scrollY > 300 ? 'scale(1)' : 'scale(0.8)';
        });
        btn.addEventListener('click', () => { window.scrollTo({ top:0, behavior:'smooth' }); });
    },
    enhanceNavigation: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        window.scrollTo({ top: target.offsetTop-100, behavior:'smooth' });
                    }
                }
            });
        });
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('mouseenter', function() { if(window.innerWidth>992)this.click(); });
        });
    },
    enhanceForms: function() {
        document.querySelectorAll('form').forEach(form => {
            form.querySelectorAll('[required]').forEach(input => {
                input.addEventListener('invalid', function(){ this.classList.add('is-invalid'); });
                input.addEventListener('input', function(){ if(this.checkValidity()) this.classList.remove('is-invalid'); });
            });
            form.addEventListener('submit', function(e){
                const submitBtn = this.querySelector('button[type="submit"]');
                if(submitBtn){
                    const originalText = submitBtn.innerHTML;
                    setTimeout(()=>{
                        SoulinkUtils.showNotification('Formulario enviado correctamente','success');
                        if(!form.hasAttribute('data-no-reset')) form.reset();
                        if(submitBtn){ submitBtn.innerHTML=originalText; submitBtn.disabled=false; }
                    },1500);
                    submitBtn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Enviando...';
                    submitBtn.disabled=true;
                }
            });
        });
    },
    enhanceCards: function() {
        document.querySelectorAll('.service-card, .team-card, .test-card, .resource-card, .card').forEach(card=>{
            card.style.transition='transform 0.3s ease, box-shadow 0.3s ease';
            card.addEventListener('mouseenter',()=>{ card.style.transform='translateY(-8px)'; card.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)'; });
            card.addEventListener('mouseleave',()=>{ card.style.transform='translateY(0)'; card.style.boxShadow=''; });
        });
    },
    initPageSpecificFeatures: function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        SoulinkUtils.log(`Página actual: ${currentPage}`);
        switch(currentPage){
            case 'index.html': this.initHomePage(); break;
            case 'servicios.html': this.initServicesPage(); break;
            case 'contacto.html': this.initContactPage(); break;
            case 'login.html': break;
            case 'comunidad.html': this.initCommunityPage(); break;
            case 'colaboraciones.html': this.initCollaborationsPage(); break;
            case 'acerca.html': this.initAboutPage(); break;
            case 'admin.html': this.initAdminPage(); break;
            case 'tienda.html': this.initTiendaPage(); break;
        }
    },

    // ======= PÁGINA TIENDA ACTUALIZADA =======
    initTiendaPage: function() {
        SoulinkUtils.log('Inicializando página de tienda');
        const tiendaContainer = document.getElementById('productosContainer');
        if(!tiendaContainer) return;

        fetch(obtenerRuta('../data/productos.json'))
        .then(res => { if(!res.ok) throw new Error('No se pudo cargar productos.json'); return res.json(); })
        .then(productos => {
            tiendaContainer.innerHTML = productos.map(producto => {
                let imgSrc = producto.imagen;
                if(!imgSrc.startsWith('http')){
                    imgSrc = obtenerRuta(`../assets/images/MerchConsejin/${producto.categoria}/${imgSrc}`);
                }
                return `<div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${imgSrc}" class="card-img-top" alt="${producto.nombre}" onerror="this.src='${obtenerRuta('../assets/images/placeholder.png')}'">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion}</p>
                            <p class="font-weight-bold mt-auto">$${producto.precio.toLocaleString()}</p>
                            <button class="btn btn-primary btnAgregarCarrito" data-id="${producto.id}">Agregar al carrito</button>
                        </div>
                        <div class="card-footer text-muted text-small">${producto.autor||''}</div>
                    </div>
                </div>`;
            }).join('');

            document.querySelectorAll('.btnAgregarCarrito').forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    let carrito = JSON.parse(localStorage.getItem('carrito')||'[]');
                    carrito.push(parseInt(btn.getAttribute('data-id')));
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    const cartBadge = document.getElementById('cartBadgeNav');
                    if(cartBadge){ cartBadge.textContent=carrito.length; cartBadge.style.display='inline'; }
                    SoulinkUtils.showNotification('Producto agregado al carrito','success');
                });
            });
        })
        .catch(err=>{
            SoulinkUtils.log('Error cargando productos:', err);
            tiendaContainer.innerHTML='<p class="text-danger">No se pudieron cargar los productos.</p>';
        });
    },

    initHomePage: function() { /* ... */ },
    initServicesPage: function() { /* ... */ },
    initContactPage: function() { /* ... */ },
    initCommunityPage: function() { /* ... */ },
    initCollaborationsPage: function() { /* ... */ },
    initAboutPage: function() { /* ... */ },
    initAdminPage: function() { /* ... */ },

    initCarrito: function() {
        const carrito = JSON.parse(localStorage.getItem('carrito')||'[]');
        const cartBadge = document.getElementById('cartBadgeNav');
        if(cartBadge){
            if(carrito.length>0){ cartBadge.textContent=carrito.length; cartBadge.style.display='inline'; }
            else cartBadge.style.display='none';
        }
    },

    save: function(key,data){ return SoulinkUtils.save(key,data); },
    load: function(key){ return SoulinkUtils.load(key); }
};

// ===== 4. INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded',()=>{ SoulinkCore.init(); });

// Hacer funciones disponibles globalmente
window.Soulink = { utils: SoulinkUtils, core: SoulinkCore, config: SoulinkConfig };
window.verificarSesionEnNavbar = verificarSesionEnNavbar;
window.cerrarSesionGlobal = cerrarSesionGlobal;
window.esUsuarioAdmin = esUsuarioAdmin;
window.obtenerRuta = obtenerRuta;

SoulinkUtils.log('Módulo SOULINK cargado correctamente');

/**************************************************************
 * ARCHIVO PRINCIPAL DE LÓGICA - My Web Clock (Versión Unificada)
 * 
 * Este archivo contiene toda la lógica JavaScript para:
 *  - Página principal del reloj
 *  - Página de registro y autenticación
 *  - Gestión de personalización y sincronización
 * 
 * Estado: Refactorizado para centralizar toda la funcionalidad
 * Última revisión: [Fecha actual]
 **************************************************************/

// ==================== CONFIGURACIÓN GLOBAL ====================
// Variables de configuración desde localStorage
let fondoLocal = localStorage.getItem("fondo");
let fuenteLocal = localStorage.getItem("fuente");
let localHora = localStorage.getItem("tama_hora");
let localSegs = localStorage.getItem("tama_segundos");
let localFecha = localStorage.getItem("tama_fecha");

// Variables de tamaño (con valores por defecto)
let tamaHora = localHora == null ? 50 : parseInt(localHora);
let tamaSeg = localSegs == null ? 25 : parseInt(localSegs);
let tamaFecha = localFecha == null ? 12 : parseInt(localFecha);

// ==================== FUNCIONES DEL RELOJ ====================
/**
 * Agrega un cero inicial a números menores que 10
 * @param {number} i - Número a formatear
 * @returns {string} Número formateado con cero inicial si es necesario
 */
const addZero = i => {
    if (i < 10 && i >= 0) {
        i = `0${i}`;
    }
    return i;
};

/**
 * Obtiene el nombre del día de la semana en español
 * @param {number} dayIndex - Índice del día (0-6)
 * @returns {string} Nombre del día
 */
function getNombreDia(dayIndex) {
    const dias = [
        "domingo", "lunes", "martes", "miércoles",
        "jueves", "viernes", "sábado"
    ];
    return dias[dayIndex] || "domingo";
}

/**
 * Obtiene el nombre del mes en español
 * @param {number} monthIndex - Índice del mes (0-11)
 * @returns {string} Nombre del mes
 */
function getNombreMes(monthIndex) {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return meses[monthIndex] || "enero";
}

/**
 * Función principal que actualiza el reloj y fecha en tiempo real
 * Se ejecuta cada segundo mediante setInterval
 */
function printTime() {
    try {
        const d = new Date();
        const hours = addZero(d.getHours());
        const mins = addZero(d.getMinutes());
        const secs = addZero(d.getSeconds());

        // Formatear hora con tamaños configurables
        const horaCadena = `
            <span style="font-size: ${tamaHora}pt">${hours}:${mins}</span>
            <span style="font-size: ${tamaSeg}pt">:${secs}</span>
        `;

        // Formatear fecha con tamaño configurable
        const diaSem = getNombreDia(d.getDay());
        const diaMes = d.getDate();
        const mes = getNombreMes(d.getMonth());
        
        const fechaCadena = `
            <span style='font-size:${tamaFecha}pt'>
                ${diaSem} ${diaMes} de ${mes}
            </span>
        `;

        // Actualizar DOM solo si los elementos existen
        const horaElement = document.getElementById("hs_y_mins");
        const fechaElement = document.getElementById("fecha");
        
        if (horaElement) horaElement.innerHTML = horaCadena;
        if (fechaElement) fechaElement.innerHTML = fechaCadena;

        // Ajustar tamaños máximos según responsividad
        ajustarTamanosResponsivos();
    } catch (error) {
        console.error("Error en printTime:", error);
    }
}

/**
 * Ajusta los valores máximos de los controles según el ancho de pantalla
 */
function ajustarTamanosResponsivos() {
    const anchoPantalla = window.innerWidth;
    const maxTamHora = document.getElementById("max_tam_hora");
    const maxTamFecha = document.getElementById("max_tam_fecha");

    if (maxTamHora) {
        maxTamHora.max = anchoPantalla >= 601 ? 250 : 100;
    }
    
    if (maxTamFecha) {
        maxTamFecha.max = anchoPantalla >= 601 ? 60 : 30;
    }
}

// ==================== FUNCIONES DE PERSONALIZACIÓN ====================
/**
 * Aplica los colores guardados en localStorage al cargar la página
 * Funciona tanto en página principal como en registro
 */
function aplicarColoresIniciales() {
    try {
        // Aplicar al body
        document.body.style.backgroundColor = fondoLocal == null ? '#000' : fondoLocal;
        document.body.style.color = fuenteLocal == null ? '#00ff00' : fuenteLocal;

        // Aplicar a elementos específicos de navegación
        const hamburguesa = document.getElementById("hamburguesa");
        const marca = document.getElementById('marca');
        
        if (hamburguesa) {
            hamburguesa.style.color = fuenteLocal == null ? '#00ff00' : fuenteLocal;
        }
        if (marca) {
            marca.style.color = fuenteLocal == null ? '#00ff00' : fuenteLocal;
        }

        // Rellenar inputs de color si existen
        const inputFondo = document.getElementById('input_fondo');
        const inputFuente = document.getElementById('input_fuente');
        
        if (inputFondo) {
            inputFondo.value = fondoLocal == null ? '#000' : fondoLocal;
        }
        if (inputFuente) {
            inputFuente.value = fuenteLocal == null ? '#00ff00' : fuenteLocal;
        }

        // Rellenar controles de tamaño si existen
        const maxTamHora = document.getElementById('max_tam_hora');
        const maxTamFecha = document.getElementById('max_tam_fecha');
        
        if (maxTamHora) {
            maxTamHora.value = localHora == null ? 50 : localHora;
        }
        if (maxTamFecha) {
            maxTamFecha.value = localFecha == null ? 12 : localFecha;
        }
    } catch (error) {
        console.error("Error en aplicarColoresIniciales:", error);
    }
}

/**
 * Cambia el color de fondo y lo guarda en localStorage
 * @param {string} val - Valor hexadecimal del color (ej: #FF0000)
 */
function cambiarFondo(val) {
    try {
        if (!val || !val.match(/^#[0-9A-F]{6}$/i)) {
            console.warn("Valor de color no válido:", val);
            return;
        }
        
        document.body.style.backgroundColor = val;
        localStorage.setItem("fondo", val);
        
        // Actualizar input visual si existe
        const inputFondo = document.getElementById('input_fondo');
        if (inputFondo) inputFondo.value = val;
        
        // Si estamos en una sesión activa, sincronizar con backend
        sincronizarConfiguracionConBackend();
    } catch (error) {
        console.error("Error en cambiarFondo:", error);
    }
}

/**
 * Cambia el color de fuente y lo guarda en localStorage
 * @param {string} val2 - Valor hexadecimal del color
 */
function cambiarFuente(val2) {
    try {
        if (!val2 || !val2.match(/^#[0-9A-F]{6}$/i)) {
            console.warn("Valor de color no válido:", val2);
            return;
        }
        
        document.body.style.color = val2;
        localStorage.setItem("fuente", val2);
        
        // Aplicar a elementos de UI
        const hamburguesa = document.getElementById("hamburguesa");
        const marca = document.getElementById('marca');
        
        if (hamburguesa) hamburguesa.style.color = val2;
        if (marca) marca.style.color = val2;
        
        // Actualizar input visual si existe
        const inputFuente = document.getElementById('input_fuente');
        if (inputFuente) inputFuente.value = val2;
        
        // Sincronizar con backend si es necesario
        sincronizarConfiguracionConBackend();
    } catch (error) {
        console.error("Error en cambiarFuente:", error);
    }
}

/**
 * Cambia el tamaño de la hora y segundos
 * @param {string|number} val3 - Tamaño de la hora en pt
 */
function redimHora(val3) {
    try {
        const tam = parseInt(val3);
        if (isNaN(tam) || tam < 10 || tam > 250) {
            console.warn("Tamaño de hora no válido:", val3);
            return;
        }
        
        tamaHora = tam;
        tamaSeg = Math.floor(tam / 2); // Segundos a la mitad del tamaño
        localStorage.setItem("tama_hora", tam.toString());
        localStorage.setItem("tama_segundos", tamaSeg.toString());
        
        // Sincronizar con backend si es necesario
        sincronizarConfiguracionConBackend();
    } catch (error) {
        console.error("Error en redimHora:", error);
    }
}

/**
 * Cambia el tamaño de la fecha
 * @param {string|number} val4 - Tamaño de la fecha en pt
 */
const redimFecha = (val4) => {
    try {
        const tam = parseInt(val4);
        if (isNaN(tam) || tam < 8 || tam > 60) {
            console.warn("Tamaño de fecha no válido:", val4);
            return;
        }
        
        tamaFecha = tam;
        localStorage.setItem("tama_fecha", tam.toString());
        
        // Sincronizar con backend si es necesario
        sincronizarConfiguracionConBackend();
    } catch (error) {
        console.error("Error en redimFecha:", error);
    }
};

// ==================== FUNCIONES DE REGISTRO Y AUTENTICACIÓN ====================
/**
 * Prepara y envía las preferencias al formulario de registro
 * @returns {boolean} true para permitir el envío del formulario
 */
function agregarPreferencias() {
    try {
        // Verificar que todos los elementos existan
        const elementosRequeridos = [
            'pref_fondo', 'pref_fuente', 'pref_hora', 
            'pref_segundos', 'pref_fecha'
        ];
        
        for (const id of elementosRequeridos) {
            if (!document.getElementById(id)) {
                console.error(`Elemento ${id} no encontrado`);
                return false;
            }
        }

        // Asignar valores desde localStorage con valores por defecto
        document.getElementById('pref_fondo').value = 
            localStorage.getItem("fondo") || '#000';
        document.getElementById('pref_fuente').value = 
            localStorage.getItem("fuente") || '#00ff00';
        document.getElementById('pref_hora').value = 
            localStorage.getItem("tama_hora") || '50';
        document.getElementById('pref_segundos').value = 
            localStorage.getItem("tama_segundos") || '25';
        document.getElementById('pref_fecha').value = 
            localStorage.getItem("tama_fecha") || '12';
        
        console.log("Preferencias preparadas para registro");
        return true;
    } catch (error) {
        console.error("Error en agregarPreferencias:", error);
        return false;
    }
}

/**
 * Muestra/oculta botones de sesión en la interfaz
 */
function mostrar_botones_sesion() {
    try {
        const div_int_reloj = document.getElementById('div_int_reloj');
        const botones_sesion = document.getElementById('botones_sesion');
        const boton_cancelar = document.getElementById('boton_cancelar');
        const boton_acceder = document.getElementById('boton_acceder');
        
        if (div_int_reloj) div_int_reloj.classList.add('d-none');
        if (botones_sesion) botones_sesion.classList.remove('d-none');
        if (boton_cancelar) boton_cancelar.classList.remove('d-none');
        if (boton_acceder) boton_acceder.classList.add('d-none');
    } catch (error) {
        console.error("Error en mostrar_botones_sesion:", error);
    }
}

function ocultar_botones_sesion() {
    try {
        const div_int_reloj = document.getElementById('div_int_reloj');
        const botones_sesion = document.getElementById('botones_sesion');
        const boton_cancelar = document.getElementById('boton_cancelar');
        const boton_acceder = document.getElementById('boton_acceder');
        
        if (div_int_reloj) div_int_reloj.classList.remove('d-none');
        if (botones_sesion) botones_sesion.classList.add('d-none');
        if (boton_cancelar) boton_cancelar.classList.add('d-none');
        if (boton_acceder) boton_acceder.classList.remove('d-none');
    } catch (error) {
        console.error("Error en ocultar_botones_sesion:", error);
    }
}
// ==================== FUNCIONES DE REGISTRO MEJORADAS ====================

/**
 * Configura el formulario de registro para usar nuestra función
 * (NUEVA FUNCIÓN - AÑADIR ESTA)
 */
function configurarFormularioRegistro() {
    try {
        const formRegistro = document.getElementById('formRegistro');
        
        if (!formRegistro) {
            console.log("ℹ️ Formulario de registro no encontrado en esta página");
            return;
        }
        
        console.log("✅ Configurando formulario de registro...");
        
        // Configurar el evento submit (reemplaza el atributo onsubmit del HTML)
        formRegistro.addEventListener('submit', function(event) {
            console.log("📤 Formulario de registro enviado");
            
            // 1. Validar que los campos de usuario y contraseña estén completos
            const idInput = document.getElementById('id');
            const passwordInput = document.getElementById('password');
            
            if (!idInput || !idInput.value.trim()) {
                alert("❌ Por favor, ingrese un ID de usuario");
                event.preventDefault();
                return;
            }
            
            if (!passwordInput || !passwordInput.value.trim()) {
                alert("❌ Por favor, ingrese una contraseña");
                event.preventDefault();
                return;
            }
            
            if (passwordInput.value.length < 4) {
                alert("⚠️ La contraseña debe tener al menos 4 caracteres");
                event.preventDefault();
                return;
            }
            
            // 2. Ejecutar tu función existente agregarPreferencias()
            const esValido = agregarPreferencias();
            
            // 3. Si la función devuelve false, prevenir el envío
            if (!esValido) {
                event.preventDefault();
                console.log("⏸️ Envío del formulario detenido");
            } else {
                console.log("🚀 Formulario enviándose al servidor...");
                // Opcional: mostrar indicador de carga
                mostrarCargaRegistro(true);
            }
        });
        
    } catch (error) {
        console.error("❌ Error en configurarFormularioRegistro:", error);
    }
}

/**
 * Muestra/oculta un indicador de carga durante el registro
 * (NUEVA FUNCIÓN - AÑADIR ESTA)
 * @param {boolean} mostrar - true para mostrar, false para ocultar
 */
function mostrarCargaRegistro(mostrar) {
    const botonRegistro = document.querySelector('#formRegistro button[type="submit"]');
    
    if (botonRegistro) {
        if (mostrar) {
            // Guardar el texto original si es la primera vez
            if (!botonRegistro.dataset.originalText) {
                botonRegistro.dataset.originalText = botonRegistro.textContent;
            }
            botonRegistro.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...';
            botonRegistro.disabled = true;
        } else {
            // Restaurar el texto original
            if (botonRegistro.dataset.originalText) {
                botonRegistro.textContent = botonRegistro.dataset.originalText;
            } else {
                botonRegistro.textContent = 'Registrarse';
            }
            botonRegistro.disabled = false;
        }
    }
}

/**
 * Configura el botón de eliminar cuenta con mejor manejo
 * (NUEVA FUNCIÓN - AÑADIR ESTA)
 */
function configurarBotonEliminarCuenta() {
    try {
        // Buscar el botón de diferentes maneras (flexible)
        const botonEliminar = document.querySelector(
            'button[onclick*="eliminarCuenta"], ' +
            'a[href="/acceso/eliminar-cuenta"] button, ' +
            'button:contains("Eliminar la cuenta")'
        );
        
        if (botonEliminar) {
            // Remover cualquier evento onclick existente
            botonEliminar.removeAttribute('onclick');
            
            // Agregar nuestro evento mejorado
            botonEliminar.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                // Preguntar confirmación antes de proceder
                if (confirm("¿Está seguro de que desea eliminar su cuenta? Esta acción es irreversible.")) {
                    window.location.href = '/acceso/eliminar-cuenta';
                }
            });
            
            console.log("✅ Botón de eliminar cuenta configurado");
        }
    } catch (error) {
        console.error("❌ Error en configurarBotonEliminarCuenta:", error);
    }
}

/**
 * Mejora la función eliminarCuenta existente para manejar mejor el formulario
 * (MEJORA DE TU FUNCIÓN EXISTENTE - REEMPLAZAR LA ACTUAL CON ESTA)
 */
function eliminarCuenta() {
    try {
        // Primero, intentar obtener los datos del formulario de registro si existe
        let idInput = document.getElementById("id");
        let passwordInput = document.getElementById('password');
        
        // Si no están en la página actual, podrían estar en un modal o formulario separado
        if (!idInput || !passwordInput) {
            console.log("ℹ️ Campos no encontrados, redirigiendo a página de eliminación");
            window.location.href = '/acceso/eliminar-cuenta';
            return;
        }
        
        const id = idInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!id || !password) {
            alert("Por favor, complete todos los campos (ID y contraseña)");
            idInput?.focus();
            return;
        }
        
        if (!confirm("¿Está seguro de que desea eliminar su cuenta?\n\nID: " + id + "\n\nEsta acción no se puede deshacer.")) {
            return;
        }
        
        console.log("Enviando solicitud de eliminación para usuario:", id);
        
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/acceso/eliminar-cuenta", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    alert(response.mensaje || "✅ Cuenta eliminada correctamente");
                    
                    // Limpiar localStorage y redirigir
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                    
                } catch (e) {
                    alert("✅ Cuenta eliminada correctamente");
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                }
            } else {
                alert("❌ Error al eliminar la cuenta. Verifique sus credenciales.");
            }
        };
        
        xhr.onerror = function() {
            alert("❌ Error de conexión. Intente nuevamente.");
        };
        
        xhr.timeout = 10000; // 10 segundos de timeout
        xhr.ontimeout = function() {
            alert("⏰ La solicitud está tardando demasiado. Intente nuevamente.");
        };
        
        xhr.send(JSON.stringify({
            id: id,
            password: password
        }));
        
    } catch (error) {
        console.error("❌ Error en eliminarCuenta:", error);
        alert("Ocurrió un error inesperado. Por favor, intente nuevamente.");
    }
}
// ==================== FUNCIONES DE PANTALLA COMPLETA (Versión Optimizada) ====================

/**
 * Función unificada para activar/desactivar pantalla completa
 * Reemplaza tanto launchFullScreen como cancelFullScreen
 */
function togglePantallaCompleta() {
    try {
        if (!document.fullscreenElement &&
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement &&
            !document.msFullscreenElement) {
            // Activar pantalla completa
            const element = document.documentElement;
            
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                element.webkitRequestfullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen();
            }
        } else {
            // Desactivar pantalla completa
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    } catch (error) {
        console.error("Error en togglePantallaCompleta:", error);
    }
}

/**
 * Actualiza el icono según el estado actual de pantalla completa
 */
function actualizarIconoPantallaCompleta() {
    try {
        const my_use = document.getElementById("my_use");
        if (!my_use) {
            console.warn("Elemento 'my_use' no encontrado en esta página");
            return;
        }
        
        // Verificar estado actual
        const isFullscreen = !!(document.fullscreenElement ||
                                document.webkitFullscreenElement || 
                                document.mozFullScreenElement ||
                                document.msFullscreenElement);
        
        // Actualizar icono
        const href = isFullscreen ? "#fullscreen-exit" : "#arrows-fullscreen";
        my_use.setAttribute("xlink:href", href);
        
        // También actualizar el título del tooltip (opcional, mejora accesibilidad)
        const my_li = document.getElementById("my_li");
        if (my_li) {
            my_li.title = isFullscreen ? "Salir de pantalla completa" : "Pantalla completa";
        }
        
    } catch (error) {
        console.error("Error en actualizarIconoPantallaCompleta:", error);
    }
}

/**
 * Inicializa toda la funcionalidad de pantalla completa
 */
function inicializarPantallaCompleta() {
    try {
        const my_li = document.getElementById("my_li");
        const my_use = document.getElementById("my_use");
        
        // Si no hay elementos de pantalla completa, salir silenciosamente
        if (!my_li || !my_use) {
            return; // No es un error, simplemente esta página no tiene el botón
        }
        
        console.log("Inicializando pantalla completa...");
        
        // 1. Configurar el evento de clic
        my_li.addEventListener("click", togglePantallaCompleta);
        
        // 2. Configurar icono inicial
        actualizarIconoPantallaCompleta();
        
        // 3. Escuchar cambios de estado (F11, Escape, etc.)
        const eventosCambio = [
            'fullscreenchange',
            'webkitfullscreenchange', 
            'mozfullscreenchange',
            'MSFullscreenChange'
        ];
        
        eventosCambio.forEach(evento => {
            document.addEventListener(evento, actualizarIconoPantallaCompleta);
        });
        
        // 4. También actualizar al redimensionar (por si acaso)
        window.addEventListener('resize', actualizarIconoPantallaCompleta);
        
    } catch (error) {
        console.error("Error en inicializarPantallaCompleta:", error);
    }
}

// ==================== FUNCIONES DE SINCRONIZACIÓN ====================
/**
 * Sincroniza la configuración local con el backend (si el usuario está autenticado)
 */
async function sincronizarConfiguracionConBackend() {
    try {
        // Verificar si hay token de autenticación
        const token = localStorage.getItem('auth_token');
        if (!token) return; // Usuario no autenticado
        
        const config = {
            fondo: localStorage.getItem("fondo") || '#000',
            fuente: localStorage.getItem("fuente") || '#00ff00',
            tamano_hora: localStorage.getItem("tama_hora") || '50',
            tamano_segundos: localStorage.getItem("tama_segundos") || '25',
            tamano_fecha: localStorage.getItem("tama_fecha") || '12'
        };
        
        // Aquí iría la llamada al backend
        // await fetch('/api/user/config', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(config)
        // });
        
        console.log("Configuración sincronizada (simulado)", config);
    } catch (error) {
        console.error("Error en sincronizarConfiguracionConBackend:", error);
    }
}

// ==================== FUNCIONES DE UTILIDAD ====================
/**
 * Restablece toda la configuración a los valores por defecto
 */
function reset() {
    try {
        if (!confirm("¿Restaurar la configuración inicial? Se perderán todos sus ajustes.")) {
            return;
        }
        
        localStorage.clear();
        
        // Restaurar valores por defecto
        fondoLocal = '#000';
        fuenteLocal = '#00ff00';
        tamaHora = 50;
        tamaSeg = 25;
        tamaFecha = 12;
        
        // Aplicar cambios inmediatamente
        aplicarColoresIniciales();
        
        // Recargar para aplicar todos los cambios
        setTimeout(() => {
            location.reload();
        }, 500);
        
    } catch (error) {
        console.error("Error en reset:", error);
    }
}

/**
 * Muestra valores de configuración actuales en consola (para debugging)
 */
function valores() {
    console.log("=== CONFIGURACIÓN ACTUAL ===");
    console.log("Fondo:", localStorage.getItem("fondo"));
    console.log("Fuente:", localStorage.getItem("fuente"));
    console.log("Tamaño hora:", localStorage.getItem("tama_hora"));
    console.log("Tamaño segundos:", localStorage.getItem("tama_segundos"));
    console.log("Tamaño fecha:", localStorage.getItem("tama_fecha"));
    console.log("============================");
}

// ==================== INICIALIZACIÓN ====================
/**
 * Detecta el tipo de página y ejecuta la inicialización correspondiente
 */
function inicializarAplicacion() {
    try {
        // 1. Aplicar colores iniciales (funciona en todas las páginas)
        aplicarColoresIniciales();
        
        // 2. Inicializar pantalla completa con la nueva función optimizada
        inicializarPantallaCompleta(); // <- REEMPLAZA las 4 líneas de addEventListener
        
        // 3. Detectar tipo de página y ejecutar lógica específica
        if (document.getElementById('hs_y_mins')) {
            // Página principal del reloj
            console.log("Inicializando página principal del reloj");
            
            // Iniciar reloj
            setInterval(printTime, 1000);
            printTime(); // Ejecutar inmediatamente
            
            // Configurar eventos de redimensionamiento
            window.addEventListener('resize', ajustarTamanosResponsivos);
            ajustarTamanosResponsivos();
            
        } else if (document.getElementById('pref_fondo')) {
            // Página de registro
            console.log("Inicializando página de registro");
            
            // Configurar evento para el formulario
            const form = document.querySelector('form[action="/acceso/registrarse"]');
            if (form) {
                form.onsubmit = agregarPreferencias;
            }
            
            // Configurar botón de eliminar cuenta si existe
            const btnEliminar = document.querySelector('button[onclick*="eliminarCuenta"]');
            if (btnEliminar) {
                btnEliminar.onclick = eliminarCuenta;
            }
        }
        
        console.log("Aplicación inicializada correctamente");
    } catch (error) {
        console.error("Error en inicializarAplicacion:", error);
    }
}

// ==================== EJECUCIÓN PRINCIPAL ====================
// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacion);
} else {
    inicializarAplicacion();
}

// Hacer funciones disponibles globalmente (necesario para onclick en HTML)
window.cambiarFondo = cambiarFondo;
window.cambiarFuente = cambiarFuente;
window.redimHora = redimHora;
window.redimFecha = redimFecha;
window.reset = reset;
window.valores = valores;
window.agregarPreferencias = agregarPreferencias;
window.eliminarCuenta = eliminarCuenta;
window.mostrar_botones_sesion = mostrar_botones_sesion;
window.ocultar_botones_sesion = ocultar_botones_sesion;
window.launchFullScreen = launchFullScreen;
window.cancelFullScreen = cancelFullScreen;

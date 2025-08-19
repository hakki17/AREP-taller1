/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

// gallery.js - Funcionalidades para la galería de imágenes

// Array de imágenes disponibles
const availableImages = [
    {
        src: 'images/web-development.jpg',
        alt: 'Desarrollo Web',
        title: 'Desarrollo Web Moderno',
        description: 'Tecnologías y herramientas para el desarrollo web actual'
    },
    {
        src: 'images/java-logo.png',
        alt: 'Java Logo',
        title: 'Lenguaje Java',
        description: 'Logo oficial del lenguaje de programación Java'
    },
    {
        src: 'images/server.jpg',
        alt: 'Servidor',
        title: 'Infraestructura de Servidores',
        description: 'Servidores y centros de datos modernos'
    },
    {
        src: 'images/rest-api.png',
        alt: 'REST API',
        title: 'API RESTful',
        description: 'Arquitectura de servicios web REST'
    }
];

// Función para cargar una imagen aleatoria
function loadRandomImage() {
    const container = document.getElementById('dynamicImage');
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];
    
    // Mostrar indicador de carga
    container.innerHTML = '<div style="color: #3498db;">🔄 Cargando imagen...</div>';
    
    // Simular carga asíncrona
    setTimeout(() => {
        const imageHTML = `
            <div class="dynamic-image-item">
                <img src="${selectedImage.src}" alt="${selectedImage.alt}" 
                     style="max-width: 300px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"
                     onload="imageLoaded(this)" 
                     onerror="imageError(this)">
                <h4 style="margin-top: 1rem; color: #2c3e50;">${selectedImage.title}</h4>
                <p style="color: #666; margin-top: 0.5rem;">${selectedImage.description}</p>
                <small style="color: #999;">Cargada: ${new Date().toLocaleTimeString()}</small>
            </div>
        `;
        
        container.innerHTML = imageHTML;
        console.log('Imagen cargada:', selectedImage);
    }, 500);
}

// Función llamada cuando una imagen se carga exitosamente
function imageLoaded(img) {
    console.log('✅ Imagen cargada exitosamente:', img.src);
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        img.style.opacity = '1';
    }, 100);
}

// Función llamada cuando hay error al cargar una imagen
function imageError(img) {
    console.error('❌ Error cargando imagen:', img.src);
    img.style.display = 'none';
    const container = img.parentElement;
    container.innerHTML += '<div style="color: #e74c3c;">❌ Error cargando imagen</div>';
}

// Función para precargar todas las imágenes
function preloadImages() {
    console.log('🖼️ Precargando imágenes...');
    
    const promises = availableImages.map(imageInfo => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                console.log('✅ Imagen precargada:', imageInfo.src);
                resolve(imageInfo);
            };
            img.onerror = () => {
                console.warn('⚠️ Error precargando:', imageInfo.src);
                reject(imageInfo);
            };
            img.src = imageInfo.src;
        });
    });
    
    Promise.allSettled(promises).then(results => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        console.log(`📊 Precarga completada: ${successful} exitosas, ${failed} fallidas`);
        
        // Mostrar estadísticas en la página
        showImageStats(successful, failed);
    });
}

// Función para mostrar estadísticas de imágenes
function showImageStats(loaded, failed) {
    const statsHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-top: 1rem;">
            <h4>📊 Estadísticas de imágenes:</h4>
            <p>✅ Cargadas exitosamente: ${loaded}</p>
            <p>❌ Con errores: ${failed}</p>
            <p>📁 Total disponibles: ${availableImages.length}</p>
        </div>
    `;
    
    const statsContainer = document.getElementById('imageStats');
    if (statsContainer) {
        statsContainer.innerHTML = statsHTML;
    }
}

// Función para crear una galería dinámica
function createDynamicGallery() {
    const galleryContainer = document.getElementById('dynamicGallery');
    if (!galleryContainer) return;
    
    let galleryHTML = '<div class="dynamic-gallery-grid">';
    
    availableImages.forEach((image, index) => {
        galleryHTML += `
            <div class="gallery-item-dynamic" onclick="showImageModal(${index})">
                <img src="${image.src}" alt="${image.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${image.title}</h4>
                    <p>Click para ampliar</p>
                </div>
            </div>
        `;
    });
    
    galleryHTML += '</div>';
    galleryContainer.innerHTML = galleryHTML;
}

// Función para mostrar modal de imagen
function showImageModal(index) {
    const image = availableImages[index];
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal(this)">&times;</span>
            <img src="${image.src}" alt="${image.alt}">
            <div class="modal-info">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    console.log('🖼️ Modal abierto para:', image.title);
}

// Función para cerrar modal
function closeModal(closeBtn) {
    const modal = closeBtn.closest('.image-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
    
    console.log('❌ Modal cerrado');
}

// Función para probar la carga de imágenes desde el servidor
function testImageServer() {
    console.log('🧪 Probando servidor de imágenes...');
    
    const testResults = [];
    
    availableImages.forEach((imageInfo, index) => {
        const startTime = performance.now();
        
        fetch(imageInfo.src, { method: 'HEAD' })
            .then(response => {
                const endTime = performance.now();
                const loadTime = endTime - startTime;
                
                const result = {
                    index: index + 1,
                    src: imageInfo.src,
                    status: response.status,
                    loadTime: loadTime.toFixed(2),
                    success: response.ok
                };
                
                testResults.push(result);
                console.log(`📊 Imagen ${index + 1}:`, result);
                
                if (testResults.length === availableImages.length) {
                    showTestResults(testResults);
                }
            })
            .catch(error => {
                const result = {
                    index: index + 1,
                    src: imageInfo.src,
                    error: error.message,
                    success: false
                };
                
                testResults.push(result);
                console.error(`❌ Error imagen ${index + 1}:`, result);
                
                if (testResults.length === availableImages.length) {
                    showTestResults(testResults);
                }
            });
    });
}

// Función para mostrar resultados de prueba
function showTestResults(results) {
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const avgLoadTime = results
        .filter(r => r.loadTime)
        .reduce((sum, r) => sum + parseFloat(r.loadTime), 0) / successful;
    
    console.log(`📈 Resultados de prueba de imágenes:`);
    console.log(`✅ Exitosas: ${successful}/${results.length}`);
    console.log(`❌ Fallidas: ${failed}/${results.length}`);
    console.log(`⏱️ Tiempo promedio: ${avgLoadTime.toFixed(2)}ms`);
}

// Función para lazy loading manual
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    console.log('👁️ Imagen visible:', img.src);
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🖼️ Galería de imágenes cargada');
    
    // Precargar imágenes
    preloadImages();
    
    // Crear galería dinámica si existe el contenedor
    createDynamicGallery();
    
    // Inicializar lazy loading
    initLazyLoading();
    
    // Probar servidor de imágenes después de 2 segundos
    setTimeout(testImageServer, 2000);
    
    // Agregar efectos hover a las imágenes de la galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});


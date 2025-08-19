# AREP-taller1

# Servidor HTTP con Java

Este servicio implementa un servidor HTTP básico desarrollado completamente en Java sin usar frameworks externos como Spring o Spark. El servidor es capaz de manejar múltiples solicitudes secuenciales.

## Descripción

El servidor web maneja solicitudes HTTP GET y POST, el get pide una información al usuario (nombre) y el post cambia esa información con una nueva. Además acepta contenido desde el disco local (HTML, CSS, JavaScript, imágenes) y proporciona una API REST para demostrar la comunicación asíncrona entre cliente y servidor.

# Arquitectura cliente-servidor

## Instalación

### Requisitos previos
- Java 8 o superior
- Git
- Un navegador web moderno

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/hakki17/AREP-taller1
cd AREP-taller1
```

2. Compilar el proyecto:
  mvn clean install

```bash
javac -d . src/main/java/code/escuelaing/httpserver/Httpserver.java
```

## Cómo ejecutar

1. Ejecutar el servidor:
```bash
java code.escuelaing.httpserver.Httpserver
```

2. El servidor iniciará en el puerto 35000

3. Abrir el navegador y visitar:
```
http://localhost:35000
```

4. Para detener el servidor, presionar Ctrl+C en la terminal

## Arquitectura del Prototipo

### Componentes principales

**Servidor HTTP (Httpserver.java)**
- Clase principal que implementa el servidor
- Procesa requests HTTP de forma secuencial (no concurrente)

**Estructura del servidor:**

![](https://github.com/hakki17/AREP-taller1/blob/main/img/1.png)
![](https://github.com/hakki17/AREP-taller1/blob/main/img/2.png)


### Funcionalidades implementadas

**1. Servir archivos estáticos**
- Lee archivos desde el directorio webroot
- Determina tipos correctos (HTML, CSS, JS, imágenes)

**2. API REST - GET /api/hello**
- Recibe un nombre como parámetro de consulta
- Almacena el nombre en memoria
- Retorna respuesta con el nombre

**3. API REST - POST /api/updateName**
- Recibe datos JSON en el cuerpo de la request
- Actualiza apellido en memoria
- Retorna confirmación

## Pruebas realizadas

### Pruebas de archivos estáticos
1. **Página principal**: Verificar que index.html se carga correctamente
2. **Estilos CSS**: Confirmar que styles.css se aplica
3. **JavaScript**: Comprobar que main.js se ejecuta
4. **Imágenes**: Validar que las imágenes se muestran
5. **Archivos inexistentes**: Verificar respuesta 404

### Pruebas de servicios REST

![](https://github.com/hakki17/AREP-taller1/blob/main/img/3.png)
![](https://github.com/hakki17/AREP-taller1/blob/main/img/4.png)


## Estructura del proyecto

```
httpserver/
├── src/
│   └── main/
│       └── java/
│           └── code/
│               └── escuelaing/
│                   └── httpserver/
│                       └── Httpserver.java
├── webroot/
│   ├── index.html
│   ├── formularios.html
│   ├── styles.css
│   ├── main.js
│   └── img/
└── README.md
```

## Autor

Maria Sanchez - Estudiante de Ingeniería de Sistemas de la Escuela Colombiana de Ingeniería Julio Garavito

## Conclusiones

Este proyecto demostró exitosamente:
- Implementación de servidor HTTP desde cero en Java
- Manejo de diferentes tipos de contenido web
- Comunicación asíncrona cliente-servidor
- Servicios REST básicos con GET y POST
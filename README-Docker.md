# Docker Setup - Chatbot Frontend

Este documento explica cómo usar Docker para ejecutar el proyecto Chatbot Frontend en diferentes entornos.

## 📋 Prerrequisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## 🏗️ Estructura de Archivos Docker

```
chatbot-frontend/
├── Dockerfile          # Configuración multi-stage de Docker
├── docker-compose.yml  # Orquestación de servicios
├── nginx.conf         # Configuración de nginx para producción
├── .dockerignore      # Archivos excluidos del build
└── README-Docker.md   # Este archivo
```

## 🚀 Inicio Rápido

### Desarrollo Local

Para ejecutar el proyecto en modo desarrollo con hot reload:

```bash
# Construir y ejecutar en modo desarrollo
docker-compose --profile dev up --build

# O en segundo plano
docker-compose --profile dev up --build -d
```

La aplicación estará disponible en: http://localhost:5173

### Producción

Para ejecutar el proyecto en modo producción:

```bash
# Construir y ejecutar en modo producción
docker-compose --profile prod up --build

# O en segundo plano
docker-compose --profile prod up --build -d
```

La aplicación estará disponible en: http://localhost:80

## 🔧 Comandos Docker Directos

### Desarrollo

```bash
# Construir imagen de desarrollo
docker build --target development -t chatbot-frontend:dev .

# Ejecutar contenedor de desarrollo
docker run -p 5173:5173 -v $(pwd):/app chatbot-frontend:dev

# Con volúmenes para desarrollo
docker run -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  chatbot-frontend:dev
```

### Producción

```bash
# Construir imagen de producción
docker build --target production -t chatbot-frontend:prod .

# Ejecutar contenedor de producción
docker run -p 80:80 chatbot-frontend:prod

# Con variables de entorno
docker run -p 80:80 \
  -e NODE_ENV=production \
  chatbot-frontend:prod
```

### Solo Build

```bash
# Construir solo la etapa de build
docker build --target build -t chatbot-frontend:build .
```

## 📦 Perfiles de Docker Compose

### Perfil de Desarrollo (`dev`)
- **Puerto**: 5173
- **Características**:
  - Hot reload habilitado
  - Volúmenes montados para desarrollo
  - Variables de entorno de desarrollo
  - Acceso a logs en tiempo real

### Perfil de Producción (`prod`)
- **Puerto**: 80
- **Características**:
  - Nginx como servidor web
  - Optimizaciones de rendimiento
  - Headers de seguridad
  - Compresión gzip

### Perfil de Build (`build`)
- **Uso**: CI/CD pipelines
- **Características**:
  - Solo construye la aplicación
  - No ejecuta servicios

## 🔍 Comandos Útiles

### Ver logs
```bash
# Desarrollo
docker-compose --profile dev logs -f

# Producción
docker-compose --profile prod logs -f
```

### Ejecutar comandos dentro del contenedor
```bash
# Desarrollo
docker-compose --profile dev exec chatbot-frontend-dev npm run lint

# Producción
docker-compose --profile prod exec chatbot-frontend-prod nginx -t
```

### Limpiar recursos
```bash
# Detener y remover contenedores
docker-compose down

# Detener y remover contenedores + volúmenes
docker-compose down -v

# Remover imágenes no utilizadas
docker image prune -f
```

## 🛠️ Configuración Avanzada

### Variables de Entorno

Crear un archivo `.env` para configuraciones específicas:

```env
# Desarrollo
NODE_ENV=development
VITE_API_URL=http://localhost:3000

# Producción
NODE_ENV=production
VITE_API_URL=https://api.tudominio.com
```

### Personalizar puertos

Modificar `docker-compose.yml` para cambiar puertos:

```yaml
services:
  chatbot-frontend-dev:
    ports:
      - "3000:5173"  # Puerto local:Puerto contenedor
```

### Configuración de Nginx

El archivo `nginx.conf` incluye:
- Configuración para React Router (SPA)
- Headers de seguridad
- Compresión gzip
- Cache de assets estáticos
- Health check endpoint

## 🔒 Seguridad

### Headers de Seguridad Incluidos
- `X-Frame-Options`: Previene clickjacking
- `X-XSS-Protection`: Protección XSS
- `X-Content-Type-Options`: Previene MIME sniffing
- `Referrer-Policy`: Control de referrer
- `Content-Security-Policy`: Política de seguridad de contenido

### Buenas Prácticas
- Usar imágenes Alpine para menor tamaño
- Multi-stage builds para optimizar
- No ejecutar como root en producción
- Escanear imágenes regularmente

## 📊 Monitoreo

### Health Check
```bash
# Verificar estado del contenedor
curl http://localhost/health
```

### Logs
```bash
# Ver logs de nginx
docker-compose --profile prod exec chatbot-frontend-prod tail -f /var/log/nginx/access.log
```

## 🐛 Troubleshooting

### Problemas Comunes

**Puerto ya en uso:**
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:5173"  # Usar puerto 8080 en lugar de 5173
```

**Permisos de archivos:**
```bash
# En Linux/Mac, ajustar permisos
sudo chown -R $USER:$USER .
```

**Memoria insuficiente:**
```bash
# Aumentar memoria para Docker
# En Docker Desktop: Settings > Resources > Memory
```

**Build falla:**
```bash
# Limpiar cache de Docker
docker system prune -a
docker volume prune
```

### Verificar Estado
```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs de un contenedor específico
docker logs <container_id>

# Ver uso de recursos
docker stats
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build --target production -t chatbot-frontend .
      - name: Push to registry
        run: |
          docker tag chatbot-frontend:latest ${{ secrets.REGISTRY }}/chatbot-frontend:latest
          docker push ${{ secrets.REGISTRY }}/chatbot-frontend:latest
```

## 📚 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contribución

Para contribuir al setup de Docker:

1. Fork el repositorio
2. Crear una rama para tu feature
3. Hacer cambios y probar
4. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la misma licencia que el proyecto principal. 
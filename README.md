

# UCALMA – Frontend (React + Vite)

Este es el frontend de UCALMA, un sistema conversacional centrado en salud mental y ciberadicción. Desarrollado con **React**, **Vite** y **TailwindCSS**, ofrece una interfaz accesible, emocionalmente amigable y adaptable a múltiples dispositivos.

## 📋 Requisitos previos

- Node.js >= 18.x
- npm >= 9.x o yarn >= 1.22
- (Opcional) Docker para despliegue

## 🔑 Variables de entorno

Si necesitas conectarte a un backend o servicios externos, crea un archivo `.env` en la raíz del proyecto. Ejemplo:

```env
VITE_API_URL=https://tuservidor.api/endpoint
```

Consulta la documentación del backend para más detalles sobre las variables requeridas.

## ⚙️ Tecnologías utilizadas

- React 18 + Vite
- TypeScript
- TailwindCSS
- React Hook Form + Zod
- Axios para consumo de APIs
- Context API para manejo de sesión
- Dark mode y diseño mobile-first

## 🧩 Estructura de carpetas

src/
- components/ → Interfaz de chat, formularios, recursos
- pages/ → Login, dashboard, historial, etc.
- services/ → Conexión con backend (Axios)
- form/ → Validación con React Hook Form + Zod
- hooks/ → Estados globales, autenticación
- context/ → Proveedor de usuario y sesión

## 📦 Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linting
npm run lint
```

## 🚀 Instrucciones para ejecución local

### Clona el proyecto:

```bash
git clone https://github.com/sebasari11/chatbot-frontend.git
cd chatbot-frontend
```

### Instala las dependencias:

```bash
npm install # o yarn
```

### Ejecuta el servidor de desarrollo:
```bash             
npm run dev
```

### Abre en el navegador:
```bash
http://localhost:5173
```

## 🚢 Despliegue

Puedes desplegar este frontend en servicios como Vercel, Netlify o usando Docker. Ejemplo con Docker:

```bash
docker build -t ucalma-frontend .
docker run -p 5173:5173 ucalma-frontend
```

Para producción, asegúrate de configurar correctamente las variables de entorno.

## 📄 Licencia
Desarrollado por Universidad de Cuenca – Facultad de Ingeniería.

## 📬 Contacto

Sebastián Arias – [LinkedIn](https://www.linkedin.com/in/sebasari11/) – sebasari11@gmail.com

Repositorio: [https://github.com/sebasari11/chatbot-frontend](https://github.com/sebasari11/chatbot-frontend)


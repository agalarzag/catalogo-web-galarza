# Chamo Import - Catálogo Web Frontend

## 📖 Descripción
Plataforma e-commerce desarrollada para la evaluación técnica de MTA Software. Incluye un catálogo dinámico renderizado a partir de datos simulados, sistema de filtros múltiples y combinados, buscador en tiempo real y un carrito de cotizaciones global. Se respetó estrictamente la identidad visual de la marca y las reglas de interfaz.

## 🚀 Enlace del Proyecto
**[Ver Catálogo en Producción (Vercel)](https://catalogo-web-galarza.vercel.app/)**

## 💻 Stack Tecnológico
*   React 19, TypeScript, Vite, React Router (v7), Tailwind CSS, Lucide React.

## ⚙️ Instalación y Despliegue Local
Ejecutar los siguientes comandos en la terminal:
`npm install`
`npm run dev`

## 🏗️ Estructura Principal
*   `/public/brand` y `/public/products`: Assets visuales.
*   `/src/components`: Componentes modulares y reutilizables.
*   `/src/context`: Estado Global (Context API) para el Carrito.
*   `/src/data`: Base de datos simulada en formato JSON.
*   `/src/services`: Capa de servicio aislada simulando latencia.

## 🧠 Decisiones de Diseño y Dificultades
*   **Decisión:** Se implementó Context API puro con Hooks Personalizados para manejar el estado del carrito en toda la app sin librerías de terceros.
*   **Dificultad:** La sincronización de múltiples filtros cruzados (búsqueda con debounce, categorías, marcas, precio, stock).
*   **Solución:** Centralizar la lógica en Catalogo.tsx usando useMemo y paginación derivada (12 productos).

## 📊 Rendimiento y Accesibilidad (Lighthouse)
![Reporte Lighthouse final](/lighthouse.png)
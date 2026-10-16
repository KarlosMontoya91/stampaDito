# StampaDito — Sitio Web de Comercio Electrónico (Prototipo Funcional)

Sitio web de comercio electrónico diseñado e implementado para **StampaDito**, marca de tazas personalizadas mediante sublimación.

---

## 1. Cómo iniciar el sitio localmente

El proyecto está construido con una arquitectura estática ligera y mantenible (**HTML5 semántico + CSS3 moderno con variables y `clamp()` + JavaScript ES6 modular sin dependencias externas**), lo que permite abrirlo o servirlo en cualquier entorno Windows sin requerir instalación previa de Node.js ni gestores de paquetes.

### Opción A: Con servidor HTTP local integrado (Recomendado)
1. Haz doble clic sobre [`iniciar-sitio.bat`](./iniciar-sitio.bat) en la raíz del proyecto, o ejecuta en una terminal de PowerShell:
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .\iniciar-sitio.ps1 -Port 8080
   ```
2. Abre tu navegador en **`http://localhost:8080`**.

### Opción B: Apertura directa
- También puedes abrir directamente el archivo [`index.html`](./index.html) en Chrome, Edge, Firefox o Safari; tanto el catálogo como el personalizador (incluyendo la subida de imágenes con vista previa local) y el carrito persistente en `localStorage` funcionan sin servidor externo.

---

## 2. Estructura del proyecto y recursos organizados

```text
proyecto_stamPado/
├── index.html                        # Página principal semántica (H1 único, metadatos OG, JSON-LD, modales <dialog>)
├── iniciar-sitio.ps1                 # Servidor HTTP local nativo en PowerShell (puerto 8080)
├── iniciar-sitio.bat                 # Lanzador rápido con doble clic para Windows
├── README.md                         # Documentación técnica, comercial y de recursos
├── css/
│   └── styles.css                    # Paleta en variables CSS, escala tipográfica clamp(), mosaico bento, hovers y reduced-motion
├── js/
│   ├── data.js                       # Fuente centralizada de catálogo, colecciones, precios (MXN), textos, cintilla y FAQs
│   └── app.js                        # Interacciones: pausa de cintilla, filtros, variantes, personalizador en vivo y carrito local
├── imagenes/                         # Carpeta original del proyecto (conservada intacta sin modificaciones)
│   ├── Gemini_Generated_Image_y27ewfy27ewfy27e.jpg
│   ├── Gemini_Generated_Image_y6ab1wy6ab1wy6ab.jpg
│   ├── taza1.jpg
│   └── taza2.jpg
└── assets/                           # Recursos derivados y generados para la tienda
    ├── logo-stampadito.svg           # Logotipo original vectorial de StampaDito
    ├── favicon.svg                   # Icono vectorial de pestaña
    ├── originales-derivados/         # Copias de trabajo de los recursos originales para la sección de archivo
    └── tazas-recortadas/             # 8 mockups conceptuales de tazas con fondo transparente real (canal alfa PNG)
        ├── taza-botanica-camila.png
        ├── taza-nombre-mateo.png
        ├── taza-mascota-bruno.png
        ├── taza-geometria-color.png
        ├── taza-ilustracion-gatito.png
        ├── taza-regalo-polaroid.png
        ├── taza-negocio-estudio.png
        └── taza-banner-sol.png
```

---

## 3.Decisiones de arquitectura y diseño

- **Paleta y contraste WCAG AA:**
  - Marfil cálido (`#F7F5EF`) y Negro suave (`#202020`, contraste **14.94:1**) estructuran la lectura.
  - Los acentos Rosa sandía (`#EF91AA`, contraste **7.22:1** con `#202020`), Verde menta (`#B9DDCC`, **11.08:1**), Verde lima suave (`#D4E678`, **11.94:1**) y Azul cielo (`#A8D2E3`, **10.08:1**) se distribuyen por bloques y colecciones usando siempre texto oscuro de alto contraste sobre fondos claros.
- **Tipografía (2 familias):**
  - **Títulos:** *Fraunces* (serif expresiva de alto contraste y personalidad editorial).
  - **Navegación, precios y cuerpo:** *Plus Jakarta Sans* (sans-serif geométrica de gran legibilidad en español).
- **Separación de capas y efecto de profundidad (Overflow visible):**
  - En el Hero, el mosaico de colecciones, las tarjetas de producto y el banner promocional, la capa de fondo redondeada (`.product-card__bg`, `.bento-card__surface`, `.hero-showcase__bg`) está separada de la figura de la taza recortada. En dispositivos con puntero fino (`@media (hover: hover)`), la taza se eleva `10px`, escala entre `1.045` y `1.055` y rota hasta `1.6deg` con transiciones de `280ms`, sin tapar precios ni botones.

---

## 4. Lista de datos comerciales e integraciones pendientes

Para pasar de este prototipo funcional a producción con cobros reales, quedan pendientes de definir por parte del negocio:

1. **Catálogo y precios definitivos (`js/data.js`):**
   - Sustituir los precios de referencia actuales (`$210`–`$255 MXN`) por los precios comerciales definitivos e impuestos aplicables.
   - Reemplazar los mockups conceptuales de referencia (`assets/tazas-recortadas/*.png`) por fotografías de estudio de lotes reales fabricados a medida que se produzcan.
2. **Logística, envíos y tiempos de producción:**
   - Definir plazos reales de sublimación (p. ej. horas/días hábiles), cobertura de envíos locales/nacionales, tarifas de paquetería y opción de recolección en taller.
3. **Pasarela de pagos y backend de pedidos:**
   - Conectar el resumen estructurado del carrito (`state.cart` en `js/app.js`) con un proveedor de pagos (Stripe, Mercado Pago o Shopify Storefront API) y un almacenamiento en la nube para recibir los archivos PNG/JPG subidos por el cliente.
4. **Datos de contacto y textos legales en el pie de página:**
   - Completar correo oficial de atención, enlace de WhatsApp/Instagram, ubicación física y documentos legales (Términos y condiciones, Aviso de privacidad y Política de devoluciones en productos personalizados).

/**
 * StampaDito — Configuración centralizada de catálogo, colecciones, textos y estado comercial
 * --------------------------------------------------------------------------------------------
 * NOTA DE DESARROLLO:
 * Como la carpeta original del proyecto contenía únicamente imágenes de referencia sin archivo
 * de precios ni catálogo oficial, los importes, variantes y textos comerciales aquí reunidos
 * son DATOS DE DEMOSTRACIÓN CENTRALIZADOS para el prototipo funcional.
 * Pueden actualizarse en un único lugar antes de conectar pasarela de pago o inventario real.
 */

window.STAMPADITO_DATA = {
  meta: {
    brandName: "StampaDito",
    tagline: "StampaDito crea tazas personalizadas con diseño y personalidad",
    isDemoMode: true,
    demoNoticeShort: "Catálogo y precios de demostración · Prototipo sin cobros en línea",
    demoNoticeDetail:
      "Los precios, capacidades y opciones mostrados en esta vista corresponden a datos de demostración centralizados (js/data.js). Los mockups de tazas son composiciones conceptuales de referencia generadas para ilustrar el catálogo.",
    currency: {
      code: "MXN",
      symbol: "$",
      locale: "es-MX",
      suffix: "MXN"
    }
  },

  promoBar: {
    enabled: true,
    items: [
      "Tu idea, tu taza · Diseños con personalidad",
      "Sublimación de alta definición · Tazas personalizadas una a una",
      "Personaliza con tu nombre, tu foto o ilustraciones originales",
      "Vista previa interactiva al instante en tu navegador"
    ]
  },

  hero: {
    badge: "Estudio de tazas personalizadas · Sublimación creativa",
    title: "Tu idea merece su propia taza.",
    description:
      "En StampaDito transformamos nombres, fotografías, trazos y ocurrencias en tazas personalizadas mediante sublimación. Piezas cotidianas con carácter gráfico, color vibrante y un diseño pensado para acompañarte todos los días.",
    primaryCta: {
      label: "Explorar tazas",
      href: "#catalogo"
    },
    secondaryCta: {
      label: "Personalizar mi taza",
      action: "open-customizer"
    },
    showcaseMugs: [
      {
        id: "taza-botanica-camila",
        title: "Edición Botánica con Nombre",
        tag: "Con tu nombre",
        accent: "pink",
        image: "assets/tazas-recortadas/taza-botanica-camila.png",
        alt: "Mockup conceptual de taza personalizada blanca con ilustración botánica en rosa sandía, menta y lima con el nombre Camila"
      },
      {
        id: "taza-mascota-bruno",
        title: "Retrato Ilustrado Mascota",
        tag: "Con tus fotos",
        accent: "mint",
        image: "assets/tazas-recortadas/taza-mascota-bruno.png",
        alt: "Mockup conceptual de taza personalizada con interior y asa verde menta e ilustración de perro con gafas y el nombre Bruno"
      }
    ]
  },

  collections: [
    {
      id: "con-tu-nombre",
      title: "Con tu nombre",
      subtitle: "Tipografía expresiva, iniciales ilustradas y combinaciones cromáticas hechas para que nadie confunda tu taza.",
      badge: "Tipografía + Color",
      colorTheme: "pink", // #EF91AA
      gridSpan: "large",
      image: "assets/tazas-recortadas/taza-nombre-mateo.png",
      imageAlt: "Taza personalizada con monograma geométrico M y nombre Mateo en colores vivos",
      ctaText: "Ver colección con nombre"
    },
    {
      id: "con-tus-fotos",
      title: "Con tus fotos",
      subtitle: "Retratos de mascotas, recuerdos en formato polaroid o tu imagen favorita adaptada al formato cerámico.",
      badge: "Fotos y mascotas",
      colorTheme: "mint", // #B9DDCC
      gridSpan: "medium",
      image: "assets/tazas-recortadas/taza-mascota-bruno.png",
      imageAlt: "Taza personalizada con retrato ilustrado de mascota Bruno y asa color menta",
      ctaText: "Explorar tazas con foto"
    },
    {
      id: "ilustraciones-originales",
      title: "Ilustraciones originales",
      subtitle: "Composiciones geométricas, botánicas y personajes de estudio listos para personalizar.",
      badge: "Arte de autor",
      colorTheme: "lime", // #D4E678
      gridSpan: "medium",
      image: "assets/tazas-recortadas/taza-geometria-color.png",
      imageAlt: "Taza personalizada con patrón geométrico contemporáneo en rosa, lima, azul y negro",
      ctaText: "Descubrir ilustraciones"
    },
    {
      id: "para-regalar",
      title: "Para regalar",
      subtitle: "Detalles con mensaje propio para aniversarios, cumpleaños o cómplices del café.",
      badge: "Edición regalo",
      colorTheme: "sky", // #A8D2E3
      gridSpan: "small",
      image: "assets/tazas-recortadas/taza-regalo-polaroid.png",
      imageAlt: "Taza personalizada estilo polaroid con dos tazas brindando y frase Para Siempre",
      ctaText: "Ver ideas de regalo"
    },
    {
      id: "para-tu-negocio",
      title: "Para tu negocio",
      subtitle: "Tu logotipo o identidad visual sobre cerámica bicolor para estudios, equipos y cafeterías.",
      badge: "Logos y equipos",
      colorTheme: "mint", // #B9DDCC
      gridSpan: "small",
      image: "assets/tazas-recortadas/taza-negocio-estudio.png",
      imageAlt: "Taza personalizada con asa e interior negro y emblema de Estudio Norte",
      ctaText: "Ver opciones para marca"
    }
  ],

  products: [
    {
      id: "prod-botanica-nombre",
      slug: "taza-botanica-nombre",
      name: "Taza Botánica & Nombre",
      collection: "con-tu-nombre",
      collectionLabel: "Con tu nombre",
      shortDescription: "Composición de hojas abstractas y arco geométrico con tu nombre en tipografía de alto impacto.",
      fullDescription:
        "Diseñada para destacar en cualquier escritorio. Combina formas orgánicas en rosa sandía, verde menta y lima suave con tu nombre impreso en negro intenso en la base. Puedes conservar la paleta original o indicar tu texto personalizado.",
      price: 220,
      accentTheme: "pink",
      image: "assets/tazas-recortadas/taza-botanica-camila.png",
      imageAlt: "Taza personalizada modelo Botánica y Nombre con diseño floral moderno y el texto Camila",
      isConceptualMockup: true,
      customizableFields: ["name", "text"],
      defaultCustomText: "CAMILA",
      variants: [
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: 0 },
        { id: "rosa-11oz", label: "Interior y asa Rosa (11 oz)", colorHex: "#EF91AA", priceDelta: 25 },
        { id: "menta-11oz", label: "Interior y asa Menta (11 oz)", colorHex: "#B9DDCC", priceDelta: 25 }
      ]
    },
    {
      id: "prod-monograma-editorial",
      slug: "taza-monograma-editorial",
      name: "Taza Monograma Editorial",
      collection: "con-tu-nombre",
      collectionLabel: "Con tu nombre",
      shortDescription: "Inicial capitular ilustrada con recortes botánicos y tu nombre completo al pie.",
      fullDescription:
        "Tu inicial convertida en una pieza gráfica llena de ritmo visual. Ideal para personalizar tanto la letra principal como el nombre inferior manteniendo el equilibrio entre color y espacio en blanco.",
      price: 220,
      accentTheme: "sky",
      image: "assets/tazas-recortadas/taza-nombre-mateo.png",
      imageAlt: "Taza personalizada Monograma Editorial con la letra M ilustrada y el nombre Mateo",
      isConceptualMockup: true,
      customizableFields: ["name", "text"],
      defaultCustomText: "MATEO",
      variants: [
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: 0 },
        { id: "cielo-11oz", label: "Interior y asa Azul Cielo (11 oz)", colorHex: "#A8D2E3", priceDelta: 25 }
      ]
    },
    {
      id: "prod-retrato-mascota",
      slug: "taza-club-mascota",
      name: "Taza Club Mascota",
      collection: "con-tus-fotos",
      collectionLabel: "Con tus fotos",
      shortDescription: "Medallón gráfico bicolor para lucir la foto o retrato de tu compañero inseparable junto a su nombre.",
      fullDescription:
        "Sube la foto de tu perro, gato o mascota favorita y añade su nombre en la parte inferior. El medallón geométrico enmarca la imagen para darle un acabado de estudio limpio y alegre.",
      price: 250,
      accentTheme: "mint",
      image: "assets/tazas-recortadas/taza-mascota-bruno.png",
      imageAlt: "Taza personalizada Club Mascota con interior verde menta, retrato de perro con gafas y texto Bruno",
      isConceptualMockup: true,
      customizableFields: ["name", "image"],
      defaultCustomText: "BRUNO",
      variants: [
        { id: "menta-11oz", label: "Interior y asa Menta (11 oz)", colorHex: "#B9DDCC", priceDelta: 0 },
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: -20 },
        { id: "cielo-11oz", label: "Interior y asa Azul Cielo (11 oz)", colorHex: "#A8D2E3", priceDelta: 0 }
      ]
    },
    {
      id: "prod-geometria-sol",
      slug: "taza-arquitectura-color",
      name: "Taza Arquitectura de Color",
      collection: "ilustraciones-originales",
      collectionLabel: "Ilustraciones originales",
      shortDescription: "Mosaico envolvente de arcos, ondas y bloques contrastados con opción de añadir dedicatoria.",
      fullDescription:
        "Inspirada en el diseño textil y la geometría contemporánea. Sus bloques en rosa sandía, verde lima, azul cielo y negro suave crean una pieza con fuerza propia, con espacio opcional en el reverso para tu frase o nombre.",
      price: 210,
      accentTheme: "lime",
      image: "assets/tazas-recortadas/taza-geometria-color.png",
      imageAlt: "Taza personalizada Arquitectura de Color con bloques geométricos en rosa, lima, azul y negro",
      isConceptualMockup: true,
      customizableFields: ["name", "text"],
      defaultCustomText: "DISEÑO ORIGINAL",
      variants: [
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: 0 },
        { id: "negra-11oz", label: "Interior y asa Negro Suave (11 oz)", colorHex: "#202020", priceDelta: 25 }
      ]
    },
    {
      id: "prod-gatito-jardin",
      slug: "taza-gatito-entre-flores",
      name: "Taza Michi en el Jardín",
      collection: "ilustraciones-originales",
      collectionLabel: "Ilustraciones originales",
      shortDescription: "Ilustración original de gato curioso rodeado de flores gráficas en rosa sandía y hojas lima.",
      fullDescription:
        "Una de nuestras ilustraciones de estudio más expresivas. El contraste del gato negro con los pétalos en rosa sandía y el borde azul cielo aporta calidez y personalidad a cada mañana. Personalizable con nombre al dorso.",
      price: 235,
      accentTheme: "sky",
      image: "assets/tazas-recortadas/taza-ilustracion-gatito.png",
      imageAlt: "Taza personalizada Michi en el Jardín con asa azul cielo e ilustración de gato negro entre flores",
      isConceptualMockup: true,
      customizableFields: ["name", "text"],
      defaultCustomText: "MICHI CLUB",
      variants: [
        { id: "cielo-11oz", label: "Interior y asa Azul Cielo (11 oz)", colorHex: "#A8D2E3", priceDelta: 0 },
        { id: "rosa-11oz", label: "Interior y asa Rosa (11 oz)", colorHex: "#EF91AA", priceDelta: 0 },
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: -20 }
      ]
    },
    {
      id: "prod-polaroid-regalo",
      slug: "taza-instante-polaroid",
      name: "Taza Instante Polaroid",
      collection: "para-regalar",
      collectionLabel: "Para regalar",
      shortDescription: "Marco tipo instantánea para subir tu fotografía especial o conservar la ilustración de brindis con tu frase.",
      fullDescription:
        "Pensada para regalar un recuerdo tangible. Puedes cargar tu propia fotografía dentro del recuadro tipo polaroid y escribir debajo una fecha, lugar o frase corta que tenga significado especial.",
      price: 245,
      accentTheme: "pink",
      image: "assets/tazas-recortadas/taza-regalo-polaroid.png",
      imageAlt: "Taza personalizada Instante Polaroid con interior rosa e ilustración de dos tazas brindando con texto Para Siempre",
      isConceptualMockup: true,
      customizableFields: ["name", "text", "image"],
      defaultCustomText: "PARA SIEMPRE",
      variants: [
        { id: "rosa-11oz", label: "Interior y asa Rosa (11 oz)", colorHex: "#EF91AA", priceDelta: 0 },
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: -20 },
        { id: "menta-11oz", label: "Interior y asa Menta (11 oz)", colorHex: "#B9DDCC", priceDelta: 0 }
      ]
    },
    {
      id: "prod-identidad-estudio",
      slug: "taza-identidad-negocio",
      name: "Taza Identidad & Estudio",
      collection: "para-tu-negocio",
      collectionLabel: "Para tu negocio",
      shortDescription: "Acabado sobrio con interior en negro suave, ideal para subir el logotipo de tu marca o proyecto.",
      fullDescription:
        "Lleva la identidad visual de tu cafetería, estudio creativo o equipo a una taza bicolor de alto contraste. Sube tu logotipo en PNG o JPG y añade el nombre de cada integrante o el lema de tu marca.",
      price: 240,
      accentTheme: "mint",
      image: "assets/tazas-recortadas/taza-negocio-estudio.png",
      imageAlt: "Taza personalizada Identidad y Estudio con interior negro y logotipo geométrico Estudio Norte",
      isConceptualMockup: true,
      customizableFields: ["name", "text", "image"],
      defaultCustomText: "ESTUDIO NORTE",
      variants: [
        { id: "negra-11oz", label: "Interior y asa Negro Suave (11 oz)", colorHex: "#202020", priceDelta: 0 },
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: -20 }
      ]
    },
    {
      id: "prod-lienzo-libre",
      slug: "taza-lienzo-a-medida",
      name: "Taza Lienzo Creativo 360°",
      collection: "con-tus-fotos",
      collectionLabel: "Con tus fotos",
      shortDescription: "Parte desde un diseño vibrante o sube tu propia imagen, ilustración o collage desde cero.",
      fullDescription:
        "Para quienes tienen una idea única en mente. Combina texto libre, nombre y tu propio archivo gráfico con ayuda de nuestro configurador interactivo de referencia.",
      price: 255,
      accentTheme: "lime",
      image: "assets/tazas-recortadas/taza-banner-sol.png",
      imageAlt: "Taza personalizada Lienzo Creativo con estampado completo de soles, hojas y formas geométricas coloridas",
      isConceptualMockup: true,
      customizableFields: ["name", "text", "image"],
      defaultCustomText: "TU IDEA AQUÍ",
      variants: [
        { id: "blanca-11oz", label: "Blanca clásica (11 oz)", colorHex: "#FFFFFF", priceDelta: 0 },
        { id: "rosa-11oz", label: "Interior y asa Rosa (11 oz)", colorHex: "#EF91AA", priceDelta: 20 },
        { id: "menta-11oz", label: "Interior y asa Menta (11 oz)", colorHex: "#B9DDCC", priceDelta: 20 },
        { id: "cielo-11oz", label: "Interior y asa Azul Cielo (11 oz)", colorHex: "#A8D2E3", priceDelta: 20 }
      ]
    }
  ],

  promoBanner: {
    eyebrow: "Laboratorio de personalización StampaDito",
    title: "¿Tienes una foto, un boceto o una broma interna? Hazla taza.",
    description:
      "Prueba nuestro personalizador interactivo: elige el color del interior, escribe tu nombre o mensaje, sube tu imagen y previsualiza al instante una composición orientativa antes de guardarla en tu carrito.",
    ctaLabel: "Abrir el personalizador",
    secondaryLabel: "Ver galería de referencias reales",
    image: "assets/tazas-recortadas/taza-banner-sol.png",
    imageAlt: "Taza de cerámica inclinada con estampado colorido de soles y formas botánicas"
  },

  howItWorks: [
    {
      stepNumber: "01",
      title: "Elige tu taza",
      description:
        "Explora nuestras colecciones por estilo (con nombre, con foto, ilustradas o para tu marca) y selecciona el modelo base y la variante de color interior que prefieras.",
      accent: "pink"
    },
    {
      stepNumber: "02",
      title: "Añade tu idea",
      description:
        "Escribe el nombre o frase que quieres incluir, elige la alineación tipográfica y, si el diseño lo permite, carga desde tu dispositivo una fotografía o logotipo en formato PNG, JPG o WebP.",
      accent: "lime"
    },
    {
      stepNumber: "03",
      title: "Revisa tu diseño",
      description:
        "Comprueba en tiempo real la vista previa ilustrativa sobre la taza y agrégala a tu carrito local con todos los parámetros de personalización registrados para tu solicitud.",
      accent: "mint"
    }
  ],

  faqs: [
    {
      question: "¿Cómo funciona la vista previa de personalización en el sitio?",
      answer:
        "Al abrir el personalizador puedes escribir un nombre, añadir una frase complementaria, elegir el color de acento y subir una imagen desde tu dispositivo. El lienzo interactivo genera una vista previa ilustrativa al instante para ayudarte a componer tu idea. Ten en cuenta que esta vista es una guía visual orientativa en pantalla y no constituye una prueba exacta de color ni de curvatura final de sublimación.",
      isPendingBusinessInfo: false
    },
    {
      question: "¿Qué formatos y calidad de imagen recomiendan para subir mis fotos o logotipos?",
      answer:
        "El configurador acepta archivos de imagen en formato PNG, JPG o WebP directamente desde tu navegador. Para obtener bordes nítidos al sublimar, recomendamos imágenes claras, bien iluminadas y, en el caso de logotipos o ilustraciones, archivos PNG con fondo transparente y buena resolución.",
      isPendingBusinessInfo: false
    },
    {
      question: "¿Las imágenes del catálogo son fotos de tazas ya fabricadas?",
      answer:
        "Las imágenes recortadas del catálogo principal son mockups conceptuales de referencia creados para mostrar nuestras líneas gráficas y posibilidades de personalización. Además, incluimos una cápsula con fotografías y muestras de referencia del proyecto original para que conozcas el carácter de nuestras ideas.",
      isPendingBusinessInfo: false
    },
    {
      question: "¿Cuáles son los tiempos de producción, costos de envío y zonas de entrega?",
      answer:
        "Información comercial pendiente de confirmación por parte del negocio. Antes de activar el cobro en línea se definirán las tarifas de envío local/nacional, los plazos exactos de sublimación y las opciones de recolección.",
      isPendingBusinessInfo: true
    },
    {
      question: "¿Qué métodos de pago aceptan y cómo se confirma un pedido personalizado?",
      answer:
        "Este sitio funciona actualmente como prototipo interactivo de demostración: puedes configurar tus tazas, guardarlas en tu carrito local y descargar o copiar el resumen detallado de tu pedido, pero no se procesan pagos reales todavía. Próximamente se integrará la pasarela de pago y confirmación directa.",
      isPendingBusinessInfo: true
    },
    {
      question: "¿Cuentan con precios especiales por mayoreo para empresas o eventos?",
      answer:
        "Dato comercial pendiente de definición. La colección «Para tu negocio» ya permite previsualizar logotipos y nombres sobre tazas bicolor; la tabla de descuentos por volumen se incorporará junto con los datos oficiales de contacto comercial.",
      isPendingBusinessInfo: true
    }
  ],

  originalProjectSamples: [
    {
      title: "Muestra gráfica «Estoy bien!»",
      caption: "Fotografía de referencia incluida en la carpeta original del proyecto (taza1.jpg).",
      image: "assets/originales-derivados/taza1.jpg",
      alt: "Fotografía de referencia de taza blanca sostenida en mano con ilustración de gato frente a laptop en llamas y texto Estoy bien"
    },
    {
      title: "Muestra gráfica «Modo enfoque»",
      caption: "Fotografía de referencia incluida en la carpeta original del proyecto (taza2.jpg).",
      image: "assets/originales-derivados/taza2.jpg",
      alt: "Fotografía de referencia de taza blanca sostenida en mano con personaje con audífonos trabajando frente a una laptop y café"
    },
    {
      title: "Concepto gráfico «+1000 AURA»",
      caption: "Mockup de referencia incluido en la carpeta inicial del proyecto.",
      image: "assets/originales-derivados/Gemini_Generated_Image_y27ewfy27ewfy27e.jpg",
      alt: "Mockup de taza blanca sobre viruta de papel kraft con texto pixelado +1000 AURA"
    }
  ]
};

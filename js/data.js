/**
 * StampaDito — Configuración centralizada de catálogo, colecciones, textos y estado comercial
 * --------------------------------------------------------------------------------------------
 */

window.STAMPADITO_DATA = {
  meta: {
    brandName: "StampaDito",
    tagline: "StampaDito crea tazas personalizadas con diseño y personalidad",
    whatsappPhone: "5215500000000", // Número de WhatsApp oficial para cotizaciones
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
      "Cotiza en tiempo real y pide directo por WhatsApp",
      "Taza Blanca Clásica $150 MXN · Taza Bicolor Full Color $200 MXN"
    ]
  },

  hero: {
    badge: "Estudio de tazas personalizadas · Sublimación creativa",
    title: "Tu idea merece su propia taza.",
    description:
      "En StampaDito transformamos tus ideas, logotipos, fotos y proyectos en tazas personalizadas mediante sublimación de alta definición. Elige tu estilo de taza, dinos qué imaginas y recibe tu precotización al instante.",
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
        image: "assets/tazas-recortadas/taza-botanica-camila.webp",
        alt: "Mockup conceptual de taza personalizada blanca con ilustración botánica en rosa sandía, menta y lima con el nombre Camila"
      },
      {
        id: "taza-mascota-bruno",
        title: "Retrato Ilustrado Mascota",
        tag: "Con tus fotos",
        accent: "mint",
        image: "assets/tazas-recortadas/taza-mascota-bruno.webp",
        alt: "Mockup conceptual de taza personalizada con interior y asa verde menta e ilustración de perro con gafas y el nombre Bruno"
      }
    ]
  },

  // 10 Colores disponibles para tazas bicolores (interior y asa)
  cupColors: [
    {
      id: "blanco",
      label: "Blanco Puro",
      colorHex: "#FFFFFF",
      bgStage: "#F6F5F2",
      image: "assets/originales-derivados/Taza blanca con interior y asa negras.webp"
    },
    {
      id: "celeste",
      label: "Azul Celeste",
      colorHex: "#5FB7E5",
      bgStage: "#EAF5FA",
      image: "assets/originales-derivados/Tazas blancas con detalles azul cielo.webp"
    },
    {
      id: "rosa",
      label: "Rosa Pastel",
      colorHex: "#F28BB2",
      bgStage: "#FDF1F5",
      image: "assets/originales-derivados/Tazas de cerámica rosa sobre fondo transparente.webp"
    },
    {
      id: "amarillo",
      label: "Amarillo Solar",
      colorHex: "#F2C744",
      bgStage: "#FEF9EC",
      image: "assets/originales-derivados/Tazas blancas con acentos amarillos brillantes.webp"
    },
    {
      id: "negro",
      label: "Negro Elegance",
      colorHex: "#1E1E1E",
      bgStage: "#ECECEC",
      image: "assets/originales-derivados/Tazas blancas con interior negro brillante.webp"
    },
    {
      id: "azul",
      label: "Azul Rey",
      colorHex: "#27599D",
      bgStage: "#EBF1F9",
      image: "assets/originales-derivados/Tazas blancas con detalles azul cielo.webp"
    },
    {
      id: "naranja",
      label: "Naranja Cítrico",
      colorHex: "#E6732B",
      bgStage: "#FCF3EB",
      image: "assets/originales-derivados/Tazas blancas con detalles naranjas.webp"
    },
    {
      id: "rojo",
      label: "Rojo Carmín",
      colorHex: "#DC3545",
      bgStage: "#FBECEE",
      image: "assets/originales-derivados/Tazas blancas con interior rojo glossy.webp"
    },
    {
      id: "morado",
      label: "Morado Lavanda",
      colorHex: "#8A5BB5",
      bgStage: "#F4EFF9",
      image: "assets/originales-derivados/Tazas blancas con detalles lavanda.webp"
    },
    {
      id: "verde",
      label: "Verde Lima",
      colorHex: "#74C342",
      bgStage: "#F2FAE9",
      image: "assets/originales-derivados/Tazas blancas con detalles verde lima.webp"
    }
  ],

  // 2 tipos de taza principales de acuerdo al nuevo modelo de negocio
  products: [
    {
      id: "taza-blanca-clasica",
      slug: "taza-blanca-clasica-personalizada",
      name: "Taza Blanca Clásica (11 oz) — Personalizada",
      tagline: "Lienzo puro cerámico de alta nitidez",
      collection: "linea-esencial",
      collectionLabel: "Línea Esencial",
      shortDescription: "Cerámica blanca brillante de grado prémium con sublimación completa a tu gusto.",
      fullDescription:
        "Nuestra opción icónica y versátil. Fabricada en cerámica blanca de 11 oz con polímero de alta densidad para máxima nitidez y fijación de tintas. Lista para plasmar tus fotos, logotipos, frases o proyectos.",
      price: 150,
      accentTheme: "sky",
      image: "assets/originales-derivados/Taza blanca con interior y asa negras.webp",
      imageAlt: "Taza personalizada de cerámica blanca clásica de 11 oz",
      isColorCustomizable: false,
      defaultColorId: "blanco"
    },
    {
      id: "taza-bicolor-fullcolor",
      slug: "taza-bicolor-fullcolor-personalizada",
      name: "Taza Bicolor Full Color (11 oz) — Color Interior y Asa",
      tagline: "Contraste vibrante con asa e interior a juego",
      collection: "linea-bicolor",
      collectionLabel: "Línea Bicolor",
      shortDescription: "Acento de color en interior y asa con 10 tonalidades a elegir y personalización de tu idea.",
      fullDescription:
        "Diseñada para cautivar con un toque editorial exclusivo. Combina un cuerpo exterior blanco para sublimar tu imagen o diseño y un interior y asa con color vibrante a juego. Elige entre 10 tonos prémium.",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Tazas de cerámica rosa sobre fondo transparente.webp",
      imageAlt: "Taza personalizada bicolor con interior y asa de color",
      isColorCustomizable: true,
      defaultColorId: "rosa"
    }
  ],

  collections: [
    {
      id: "con-tu-nombre",
      title: "Con tu nombre",
      subtitle: "Tipografía expresiva, iniciales ilustradas y combinaciones cromáticas para una taza única.",
      badge: "Tipografía + Color",
      colorTheme: "pink",
      image: "assets/tazas-recortadas/taza-nombre-mateo.webp",
      imageAlt: "Taza personalizada con monograma y nombre",
      ctaText: "Ver opciones con nombre"
    },
    {
      id: "con-tus-fotos",
      title: "Con tus fotos",
      subtitle: "Mascotas, recuerdos o momentos inolvidables sublimados con fidelidad fotográfica.",
      badge: "Fotos y recuerdos",
      colorTheme: "mint",
      image: "assets/tazas-recortadas/taza-mascota-bruno.webp",
      imageAlt: "Taza personalizada con retrato ilustrado de mascota",
      ctaText: "Ver tazas con foto"
    },
    {
      id: "ilustraciones-originales",
      title: "Ilustraciones originales",
      subtitle: "Composiciones geométricas, botánicas y diseños de autor listos para estampar.",
      badge: "Arte de autor",
      colorTheme: "lime",
      image: "assets/tazas-recortadas/taza-geometria-color.webp",
      imageAlt: "Taza personalizada con patrón de diseño moderno",
      ctaText: "Descubrir diseños"
    },
    {
      id: "para-tu-negocio",
      title: "Para tu negocio o regalo",
      subtitle: "Logotipos, identidad de marca o regalos grupales con acabados profesionales.",
      badge: "Marcas y eventos",
      colorTheme: "sky",
      image: "assets/tazas-recortadas/taza-negocio-estudio.webp",
      imageAlt: "Taza personalizada con logotipo para empresa",
      ctaText: "Cotizar para proyecto"
    }
  ],

  howItWorks: [
    {
      stepNumber: "01",
      title: "Elige tu taza",
      description:
        "Selecciona si prefieres la Taza Blanca Clásica ($150) o la Taza Bicolor con color de fondo y asa ($200) eligiendo tu color favorito entre 10 opciones vibrantes.",
      accent: "pink"
    },
    {
      stepNumber: "02",
      title: "Compártenos tu idea",
      description:
        "Sube tu foto, diseño o logotipo (opcional) y cuéntanos en las notas qué deseas plasmar, cuántas piezas necesitas y los detalles de tu personalización.",
      accent: "lime"
    },
    {
      stepNumber: "03",
      title: "Recibe tu precotización en tiempo real",
      description:
        "Obtén tu cálculo estimado al instante y con un solo clic envía tu orden directa a WhatsApp con tu imagen y especificaciones listas para agilizar la atención.",
      accent: "mint"
    }
  ],

  faqs: [
    {
      question: "¿Cuáles son los tipos de taza disponibles y sus precios?",
      answer:
        "Manejamos 2 modelos principales de 11 oz: la Taza Blanca Clásica completa con diseño a tu elección en $150 MXN (+ envío) y la Taza Bicolor (interior y asa a juego con 10 opciones de color) con personalización en $200 MXN (+ envío). El costo de envío se define en WhatsApp según tu zona y volumen."
    },
    {
      question: "¿Cómo funciona el envío del diseño e imagen por WhatsApp?",
      answer:
        "En nuestro configurador puedes adjuntar tu imagen (PNG, JPG o WebP) y describir tus ideas. Al pulsar 'Cotizar y ordenar por WhatsApp', se generará el mensaje estructurado con el desglose exacto de tus tazas, cantidades y observaciones para que nos envíes tu archivo en alta resolución de inmediato."
    },
    {
      question: "¿Puedo pedir varias tazas con el mismo diseño o con modelos diferentes?",
      answer:
        "¡Sí! En el personalizador puedes indicar la cantidad de copias exactas que necesitas (ej. 5 tazas idénticas). Además, puedes añadir múltiples estilos a tu pedido y revisar la cotización acumulada antes de enviar el mensaje final."
    },
    {
      question: "¿Cómo se cotiza y acuerda el costo de envío?",
      answer:
        "Nuestros precios de $150 y $200 son por unidad personalizada. El costo de envío se cotiza de forma personalizada y transparente directamente en WhatsApp de acuerdo con tu código postal, ciudad o entrega local acordada."
    }
  ],

  inspirationGallery: [
    {
      title: "Muestra «Estoy bien!»",
      caption: "Fotografía real de muestra en mano con arte de humor e ilustración de estudio.",
      image: "assets/originales-derivados/taza1.webp",
      alt: "Fotografía real de taza blanca sostenida en mano con gato frente a laptop en llamas y texto Estoy bien"
    },
    {
      title: "Muestra «Modo enfoque»",
      caption: "Fotografía real de muestra en mano con personaje trabajando y sublimación nítida.",
      image: "assets/originales-derivados/taza2.webp",
      alt: "Fotografía real de taza blanca sostenida en mano con personaje trabajando en laptop y café"
    },
    {
      title: "Colección Bicolor «Vibras Pop»",
      caption: "Taza rosa con interior a juego y diseño kawaii de alta definición.",
      image: "assets/originales-derivados/Taza rosa con perrito y ansiedad.webp",
      alt: "Muestra de taza rosa con perrito y detalles bicolores"
    },
    {
      title: "Concepto «+1000 AURA»",
      caption: "Diseño tipográfico de autor presentado en empaque de regalo.",
      image: "assets/originales-derivados/Gemini_Generated_Image_y27ewfy27ewfy27e.webp",
      alt: "Mockup de taza blanca sobre viruta de papel kraft con texto +1000 AURA"
    }
  ]
};

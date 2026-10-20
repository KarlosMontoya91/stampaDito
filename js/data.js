/**
 * StampaDito — Configuración centralizada de catálogo, colecciones, textos y estado comercial
 * --------------------------------------------------------------------------------------------
 */

window.STAMPADITO_DATA = {
  meta: {
    brandName: "StampaDito",
    tagline: "StampaDito crea tazas personalizadas con diseño y personalidad",
    whatsappPhone: "528132765166", // Número de WhatsApp oficial para cotizaciones (81 3276 5166)
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
      "Elige un diseño del catálogo o comparte tu propia imagen",
      "Cotiza tu pedido directo por WhatsApp"
    ]
  },

  hero: {
    badge: "StampaDito crea tazas personalizadas con diseño y personalidad",
    title: "Tu idea merece su propia taza.",
    description:
      "Transformamos nombres, fotografías, mascotas e ilustraciones originales en tazas personalizadas mediante sublimación. Colores vivos, cerámica con presencia y composiciones creadas para que tu taza hable por ti.",
    primaryCta: {
      label: "Explorar tazas",
      href: "#catalogo"
    },
    secondaryCta: {
      label: "Personalizar mi taza",
      action: "open-customizer"
    }
  },

  // 2 modelos físicos base
  baseModels: [
    {
      id: "taza-blanca-clasica",
      slug: "taza-blanca-clasica",
      name: "Taza Blanca Clásica (11 oz)",
      shortLabel: "Taza blanca (11 oz)",
      capacity: "11 oz",
      price: 150,
      isColorCustomizable: false,
      defaultColorId: "blanco",
      image: "assets/originales-derivados/Taza cerámica blanca sobre fondo transparente.png",
      imageAlt: "Taza de cerámica blanca de 11 oz"
    },
    {
      id: "taza-bicolor-fullcolor",
      slug: "taza-bicolor-fullcolor",
      name: "Taza Bicolor (11 oz) — Interior y asa de color",
      shortLabel: "Taza bicolor (11 oz)",
      capacity: "11 oz",
      price: 200,
      isColorCustomizable: true,
      defaultColorId: "rosa",
      image: "assets/originales-derivados/Tazas de cerámica rosa sobre fondo transparente.webp",
      imageAlt: "Taza bicolor de 11 oz con interior y asa de color"
    }
  ],

  // 10 Colores disponibles para tazas bicolores (interior y asa)
  cupColors: [
    {
      id: "blanco",
      label: "Blanco Puro",
      colorHex: "#FFFFFF",
      bgStage: "#F6F5F2",
      image: "assets/originales-derivados/Taza cerámica blanca sobre fondo transparente.png"
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

  // Catálogo unificado de diseños reconocibles
  catalogDesigns: [
    {
      id: "diseno-gatito-estoy-bien",
      name: "Gatito «Estoy bien»",
      orderAs: "Gatito Estoy bien",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "pink",
      image: "assets/originales-derivados/taza1.webp",
      imageAlt: "Taza blanca con diseño de gatito frente a su laptop en llamas y la frase Estoy bien!",
      isPhotoCrop: true,
      shortDescription: "Gatito frente a su laptop en llamas con la frase «Estoy bien!», ideal para días pesados en la oficina.",
      fullDescription:
        "Diseño impreso con ilustración de gatito gris frente a su laptop en llamas y la frase «Estoy bien!». Presentado sobre Taza Blanca Clásica de 11 oz. Puedes pedirlo tal como aparece o adaptarlo con un nombre o frase adicional."
    },
    {
      id: "diseno-psyduck-modo-chamba",
      name: "Psyduck en modo chamba",
      orderAs: "Psyduck en modo chamba",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "lime",
      image: "assets/originales-derivados/taza2.webp",
      imageAlt: "Taza blanca con ilustración de Psyduck con audífonos trabajando en su laptop junto a un café",
      isPhotoCrop: true,
      shortDescription: "Psyduck concentrado con audífonos, laptop y vaso de café para acompañar tu jornada de trabajo.",
      fullDescription:
        "Diseño impreso con ilustración de Psyduck usando audífonos frente a su computadora portátil y un vaso de café. Estampado sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-mas-mil-aura",
      name: "+1000 Aura",
      orderAs: "+1000 Aura",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "sky",
      image: "assets/originales-derivados/Gemini_Generated_Image_y27ewfy27ewfy27e.webp",
      imageAlt: "Taza blanca con frase pixelada +1000 AURA en letras negras y amarillas",
      isPhotoCrop: true,
      shortDescription: "Frase «+1000 AURA» con letras estilo videojuego retro en negro y amarillo.",
      fullDescription:
        "Diseño tipográfico estilo pixel art con la leyenda «+1000 AURA» en tonos negro y amarillo vibrante sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-pura-amsiedad",
      name: "Perrito «Pura amsiedad»",
      orderAs: "Perrito Pura amsiedad",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "rosa",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Taza rosa con perrito y ansiedad.webp",
      imageAlt: "Taza bicolor rosa con perrito Cheems con sombrero vaquero rosa y texto Sobrevivo por pura amsiedad",
      isPhotoCrop: false,
      shortDescription: "Perrito con sombrero vaquero rosa y la frase «Sobrevivo por pura amsiedad» en taza bicolor.",
      fullDescription:
        "Diseño de meme de perrito con sombrero vaquero rosa, destellos y la frase «Sobrevivo por pura amsiedad». Presentado en Taza Bicolor de 11 oz con interior y asa de color a elegir."
    },
    {
      id: "diseno-me-lo-dijo-chatgpt",
      name: "Me lo dijo ChatGPT",
      orderAs: "Me lo dijo ChatGPT",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "mint",
      image: "assets/originales-derivados/Taza “Me lo dijo ChatGPT” en Monterrey.png",
      imageAlt: "Taza bicolor negra con meme de rana tomando té frente a una computadora y texto Me lo dijo ChatGPT",
      isPhotoCrop: true,
      shortDescription: "Rana tomando té frente a la computadora con la frase «Me lo dijo ChatGPT».",
      fullDescription:
        "Diseño de humor con rana tomando té frente a una computadora retro y la leyenda «Me lo dijo ChatGPT». Disponible en Taza Bicolor de 11 oz con interior y asa en tu color favorito o en versión blanca."
    },
    {
      id: "diseno-que-ya-depositen",
      name: "Perrito «Que ya depositen»",
      orderAs: "Perrito Que ya depositen",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "lime",
      image: "assets/originales-derivados/Taza de perrito_ Que ya depositen.png",
      imageAlt: "Taza bicolor con interior y asa negros y perrito con ropita parchada diciendo Que ya depositen",
      isPhotoCrop: true,
      shortDescription: "Perrito esperando la quincena con la frase «Que ya depositen», ideal para el escritorio.",
      fullDescription:
        "Diseño con ilustración de perrito con ropita parchada y la frase «Que ya depositen». Configurado sobre Taza Bicolor de 11 oz con interior y asa de color."
    },
    {
      id: "diseno-endeudaditto",
      name: "Endeudaditto",
      orderAs: "Endeudaditto",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "rosa",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Taza Endeudaditto con café y bokeh.png",
      imageAlt: "Taza bicolor rosa con personaje Ditto llorando junto a su cartera vacía y texto Endeudaditto",
      isPhotoCrop: true,
      shortDescription: "Ditto con su cartera vacía y una lagrimita bajo el título «Endeudaditto».",
      fullDescription:
        "Ilustración humorística de Ditto mostrando su cartera vacía con una mosca saliendo y el texto «Endeudaditto». Presentado sobre Taza Bicolor de 11 oz con interior y asa a juego."
    },
    {
      id: "diseno-regalo-san-valentin",
      name: "Regalo «Eres mi persona favorita»",
      orderAs: "Regalo Eres mi persona favorita",
      categories: ["para-regalar"],
      categoryLabel: "Para regalar",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Referencia de presentación para regalo (el precio corresponde a la taza)",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Regalo romántico de San Valentín.png",
      imageAlt: "Presentación de regalo con taza bicolor negra Eres mi persona favorita en caja decorativa",
      isPhotoCrop: true,
      shortDescription: "Taza bicolor «Eres mi persona favorita» mostrada en idea de presentación para regalo.",
      fullDescription:
        "Taza Bicolor de 11 oz con el mensaje «Eres mi persona favorita · Feliz San Valentín» e ilustración de corazones y flecha. La imagen muestra una idea de presentación; el precio base ($200 MXN) corresponde únicamente a la taza bicolor personalizada. Consulta por WhatsApp disponibilidad y cotización si deseas armar una presentación especial."
    },
    {
      id: "diseno-foto-pareja-atardecer",
      name: "Foto romántica al atardecer",
      orderAs: "Foto romántica al atardecer",
      categories: ["con-tus-fotos"],
      categoryLabel: "Con tus fotos",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "mint",
      image: "assets/originales-derivados/Tazas románticas al atardecer.webp",
      imageAlt: "Tazas bicolores negras con fotografía real de pareja sonriendo al atardecer",
      isPhotoCrop: false,
      shortDescription: "Tu fotografía de pareja, familia o recuerdo especial impresa a todo color con bordes difuminados.",
      fullDescription:
        "Muestra de cómo luce una fotografía real impresa sobre Taza Bicolor de 11 oz con interior y asa en negro (o el tono que prefieras). Compártenos tu foto favorita para adaptarla a tu taza."
    },
    {
      id: "diseno-procafeinar",
      name: "Definición «Procafeinar»",
      orderAs: "Definición Procafeinar",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "sky",
      image: "assets/originales-derivados/Taza de café y procrastinación.png",
      imageAlt: "Taza bicolor negra en escritorio con definición de diccionario Procafeinar",
      isPhotoCrop: true,
      shortDescription: "Definición estilo diccionario: «Posponer una decisión o tarea hasta haber tomado un café».",
      fullDescription:
        "Diseño tipográfico con la definición de «Procafeinar: (f.) Posponer una decisión, situación o la ejecución de una tarea hasta no haber tomado un café». Presentado en Taza Bicolor de 11 oz."
    },
    {
      id: "diseno-lagrimas-alumnos",
      name: "Lágrimas de mis alumnos",
      orderAs: "Lágrimas de mis alumnos",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "lime",
      image: "assets/originales-derivados/Taza de lágrimas de alumnos.png",
      imageAlt: "Taza bicolor negra con frase divertida para maestros Lágrimas de mis alumnos",
      isPhotoCrop: true,
      shortDescription: "Diseño con humor para profes y maestros: «Lágrimas de mis alumnos» en letras grandes.",
      fullDescription:
        "Un clásico lleno de humor para docentes. Estampado tipográfico «Lágrimas de mis alumnos» sobre Taza Bicolor de 11 oz con interior y asa de color."
    },
    {
      id: "diseno-a-donde-sea-contigo",
      name: "A donde sea, pero contigo",
      orderAs: "A donde sea pero contigo",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Taza con mensaje y avión de papel.png",
      imageAlt: "Taza bicolor negra con ilustración de avioncito de papel y frase A donde sea, pero contigo",
      isPhotoCrop: true,
      shortDescription: "Avioncito de papel entre nubes con la frase «A donde sea, pero contigo».",
      fullDescription:
        "Ilustración de avión de papel con trazo de nubes en azul suave y la frase «A donde sea, pero contigo». Presentado en Taza Bicolor de 11 oz."
    },
    {
      id: "diseno-patito-paz-nunca-opcion",
      name: "Patito «La paz nunca fue una opción»",
      orderAs: "Patito La paz nunca fue una opción",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "lime",
      image: "assets/originales-derivados/Taza con humor y montaña al fondo.png",
      imageAlt: "Taza blanca con patito amarillo sosteniendo un cuchillo y texto La paz nunca fue una opción",
      isPhotoCrop: true,
      shortDescription: "Patito amarillo con cuchillo y la clásica frase de meme «La paz nunca fue una opción».",
      fullDescription:
        "Diseño de meme con patito amarillo sosteniendo un cuchillo de juguete y la frase «La paz nunca fue una opción», impreso sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-patito-camino-violencia",
      name: "Patito «Camino de la violencia»",
      orderAs: "Patito Camino de la violencia",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "mint",
      image: "assets/originales-derivados/Taza del patito en Monterrey.png",
      imageAlt: "Taza blanca con patito amarillo y texto Hoy elegiré el camino de la violencia",
      isPhotoCrop: true,
      shortDescription: "Variante del patito amarillo con la frase «Hoy elegiré el camino de la violencia».",
      fullDescription:
        "Ilustración de patito amarillo con la leyenda «Hoy elegiré el camino de la violencia» estampada sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-ser-adulto-una-estrella",
      name: "Ser adulto: 1 estrella",
      orderAs: "Ser adulto 1 estrella",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "sky",
      image: "assets/originales-derivados/Taza Ser Adulto en Monterrey.png",
      imageAlt: "Taza blanca con reseña de una estrella Ser adulto: Horrible experiencia, no lo recomiendo",
      isPhotoCrop: true,
      shortDescription: "Calificación de 1 de 5 estrellas: «Ser adulto. Horrible experiencia, no lo recomiendo».",
      fullDescription:
        "Diseño humorístico en formato de reseña de una sola estrella: «SER ADULTO · Horrible experiencia, no lo recomiendo». Impreso sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-mafalda-despeinada",
      name: "Mafalda de lunes",
      orderAs: "Mafalda de lunes",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "pink",
      image: "assets/originales-derivados/Taza Mafalda con montaña y ciudad.png",
      imageAlt: "Taza blanca con ilustración de Mafalda despeinada sentada con vestido rosa",
      isPhotoCrop: true,
      shortDescription: "Ilustración clásica de Mafalda despeinada y pensativa para arrancar la mañana.",
      fullDescription:
        "Diseño con ilustración de Mafalda despeinada con vestido rosa sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-primero-mi-cafe-flork",
      name: "Flork «Primero mi café»",
      orderAs: "Flork Primero mi café",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "lime",
      image: "assets/originales-derivados/Taza “Primero mi café” minimalista.webp",
      imageAlt: "Taza bicolor negra con personaje Flork sosteniendo una taza y texto Primero mi café, luego trabajo",
      isPhotoCrop: false,
      shortDescription: "Personaje Flork con su tacita y la frase «Primero mi café, luego trabajo».",
      fullDescription:
        "Diseño minimalista de Flork tomando café con la frase «Primero mi café, luego trabajo», en Taza Bicolor de 11 oz con interior y asa de color."
    },
    {
      id: "diseno-un-buen-cafe-retro",
      name: "Un buen café y a seguir",
      orderAs: "Un buen café y a seguir",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "sky",
      image: "assets/originales-derivados/Taza retro_ un buen café y más.png",
      imageAlt: "Taza bicolor negra con ilustración retro de oficinista sonriendo y texto Un buen café y a seguir auto-explotándose",
      isPhotoCrop: true,
      shortDescription: "Estilo cartel retro de oficina con humor: «Un buen café y a seguir auto-explotándose».",
      fullDescription:
        "Ilustración estilo pop retro en tonos morado y amarillo con la frase «Un buen café y a seguir auto-explotándose». Presentada en Taza Bicolor de 11 oz."
    },
    {
      id: "diseno-me-salio-en-tiktok",
      name: "Es real, me salió en TikTok",
      orderAs: "Es real me salió en TikTok",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "mint",
      image: "assets/originales-derivados/Gemini_Generated_Image_y6ab1wy6ab1wy6ab.webp",
      imageAlt: "Taza blanca con meme de rana mostrando el celular y texto Es real, me salió en Tik-Tok",
      isPhotoCrop: true,
      shortDescription: "Meme de rana mostrando su celular con la frase «Es real, me salió en Tik-Tok».",
      fullDescription:
        "Diseño de meme con rana sosteniendo un teléfono móvil y la leyenda «ES REAL · ME SALIÓ EN TIK-TOK» sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-anya-sonrisa",
      name: "Anya sonrisa pícara",
      orderAs: "Anya sonrisa pícara",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "rosa",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Taza rosa con anime y café.png",
      imageAlt: "Taza bicolor rosa con ilustración de Anya Forger haciendo su clásica expresión pícara",
      isPhotoCrop: true,
      shortDescription: "Anya con su famosa sonrisa pícara combinada con taza bicolor de interior y asa rosa.",
      fullDescription:
        "Diseño anime de Anya con su expresión clásica («Heh») sobre Taza Bicolor de 11 oz con interior y asa en rosa pastel (o el color disponible que prefieras)."
    },
    {
      id: "diseno-nezuko-chibi",
      name: "Nezuko chibi",
      orderAs: "Nezuko chibi",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "rosa",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Taza rosa con personaje chibi japonés.png",
      imageAlt: "Taza bicolor rosa con ilustración de Nezuko en versión chibi corriendo",
      isPhotoCrop: true,
      shortDescription: "Ilustración tierna de Nezuko en versión chibi sobre taza bicolor rosa.",
      fullDescription:
        "Diseño anime de Nezuko en estilo chibi sobre Taza Bicolor de 11 oz con interior y asa de color a juego."
    },
    {
      id: "diseno-cazadores-demon-slayer",
      name: "Equipo Kimetsu no Yaiba",
      orderAs: "Equipo Kimetsu no Yaiba",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "sky",
      image: "assets/originales-derivados/Taza anime de héroes coloridos.webp",
      imageAlt: "Taza blanca con ilustración grupal a todo color de los personajes de Demon Slayer",
      isPhotoCrop: true,
      shortDescription: "Composición a todo color con Tanjiro, Nezuko, Zenitsu, Inosuke y los Pilares.",
      fullDescription:
        "Estampado panorámico con los personajes principales y Pilares de Demon Slayer (Kimetsu no Yaiba) sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-arte-botanico-gatito",
      name: "Arte botánico y gatito",
      orderAs: "Arte botánico y gatito",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "lime",
      image: "assets/originales-derivados/Mugs Ilustrados con Arte Botánico.png",
      imageAlt: "Tazas bicolores negras con ilustración de retrato femenino, gatito blanco y hojas botánicas",
      isPhotoCrop: false,
      shortDescription: "Ilustración envolvente de hojas, formas orgánicas, sol y un gatito descansando.",
      fullDescription:
        "Diseño ilustrado envolvente en tonos rosa, verde olivo y azul celeste con motivos botánicos y un gatito. Presentado en Taza Bicolor de 11 oz."
    },
    {
      id: "diseno-eres-mi-persona-favorita",
      name: "Eres mi persona favorita",
      orderAs: "Eres mi persona favorita",
      categories: ["ilustraciones-originales"],
      categoryLabel: "Ilustraciones originales",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "pink",
      image: "assets/originales-derivados/Taza romántica “Eres mi persona favorita”.png",
      imageAlt: "Taza bicolor negra individual con frase Eres mi persona favorita y corazones",
      isPhotoCrop: false,
      shortDescription: "Tipografía romántica «Eres mi persona favorita» con corazones sobre taza bicolor.",
      fullDescription:
        "Versión individual de la taza con frase «Eres mi persona favorita · Feliz San Valentín» sobre Taza Bicolor de 11 oz con interior y asa en negro o el color que elijas."
    },
    {
      id: "diseno-nombre-botanico-camila",
      name: "Nombre floral «Camila»",
      orderAs: "Nombre floral Camila",
      categories: ["con-tu-nombre"],
      categoryLabel: "Con tu nombre",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "pink",
      image: "assets/tazas-recortadas/taza-botanica-camila.webp",
      imageAlt: "Taza blanca personalizada con arco botánico en tonos pastel y el nombre Camila",
      isPhotoCrop: false,
      shortDescription: "Arco botánico en tonos rosa y menta personalizado con el nombre que nos indiques.",
      fullDescription:
        "Diseño personalizable con tu nombre bajo una composición de hojas y arcos suaves en rosa y verde menta sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-monograma-mateo",
      name: "Inicial y nombre «Mateo»",
      orderAs: "Inicial y nombre Mateo",
      categories: ["con-tu-nombre"],
      categoryLabel: "Con tu nombre",
      baseModelId: "taza-blanca-clasica",
      defaultColorId: "blanco",
      presentation: "Taza individual (11 oz)",
      price: 150,
      accentTheme: "sky",
      image: "assets/tazas-recortadas/taza-nombre-mateo.webp",
      imageAlt: "Taza blanca con inicial M decorada con formas botánicas y el nombre Mateo",
      isPhotoCrop: false,
      shortDescription: "Gran letra inicial ilustrada a color acompañada de tu nombre en la base.",
      fullDescription:
        "Monograma con la inicial y el nombre que elijas, decorado con hojas y figuras geométricas en rosa, azul y verde lima sobre Taza Blanca Clásica de 11 oz."
    },
    {
      id: "diseno-mascota-bruno",
      name: "Mascota ilustrada «Bruno»",
      orderAs: "Mascota ilustrada Bruno",
      categories: ["con-tu-nombre", "ilustraciones-originales"],
      categoryLabel: "Con tu nombre",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "verde",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "mint",
      image: "assets/tazas-recortadas/taza-mascota-bruno.webp",
      imageAlt: "Taza bicolor con ilustración de perrito con lentes de sol y el nombre Bruno",
      isPhotoCrop: false,
      shortDescription: "Ilustración de perrito con lentes de sol en medallón circular y nombre personalizado.",
      fullDescription:
        "Diseño ilustrado con mascota en medallón circular y nombre personalizado en la parte inferior sobre Taza Bicolor de 11 oz."
    },
    {
      id: "diseno-logo-dwonky",
      name: "Logo empresarial «Dwonky»",
      orderAs: "Logo empresarial Dwonky",
      categories: ["para-tu-negocio"],
      categoryLabel: "Para tu negocio",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "verde",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "lime",
      image: "assets/originales-derivados/Tazas DWONKY con acabado brillante.png",
      imageAlt: "Tazas bicolores verde lima con logotipo de marca DWONKY impreso",
      isPhotoCrop: false,
      shortDescription: "Tu logotipo impreso combinando el color corporativo con el interior y el asa de la taza.",
      fullDescription:
        "Muestra de aplicación de marca (DWONKY) sobre Taza Bicolor de 11 oz con interior y asa en verde lima. Ideal para negocios, oficinas, cafeterías o regalos corporativos con tu propio logotipo."
    },
    {
      id: "diseno-marca-stampadito",
      name: "Identidad «StampaDito»",
      orderAs: "Identidad StampaDito",
      categories: ["para-tu-negocio"],
      categoryLabel: "Para tu negocio",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "celeste",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "sky",
      image: "assets/originales-derivados/Tazas estampaDito con mascota rosa.webp",
      imageAlt: "Tazas bicolores azul celeste con personaje rosa y logotipo de StampaDito",
      isPhotoCrop: false,
      shortDescription: "Logotipo y personaje de marca a todo color sobre taza bicolor azul celeste.",
      fullDescription:
        "Ejemplo de taza institucional con personaje y eslogan de marca sobre Taza Bicolor de 11 oz con interior y asa en azul celeste."
    },
    {
      id: "diseno-logo-estudio-norte",
      name: "Logo Agencia de Diseño «Karlos Montoya»",
      orderAs: "Logo Agencia de Diseño Karlos Montoya",
      categories: ["para-tu-negocio"],
      categoryLabel: "Para tu negocio",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "mint",
      image: "assets/tazas-recortadas/taza-negocio-estudio.webp",
      imageAlt: "Taza bicolor negra con logotipo de grano de café Estudio Norte",
      isPhotoCrop: false,
      shortDescription: "Diseño limpio con emblema de Logo y nombre de marca sobre taza con interior negro.",
      fullDescription:
        "Referencia de identidad gráfica para Agencia de diseño, estudios o marcas locales sobre Taza Bicolor de 11 oz con interior y asa negros."
    },
    {
      id: "diseno-logo-agencia-uxui",
      name: "Logo Agencia «UX/UI»",
      orderAs: "Logo Agencia UX/UI",
      categories: ["para-tu-negocio"],
      categoryLabel: "Para tu negocio",
      baseModelId: "taza-bicolor-fullcolor",
      defaultColorId: "negro",
      presentation: "Taza individual (11 oz)",
      price: 200,
      accentTheme: "mint",
      image: "assets/tazas-recortadas/taza-geometria-color.webp",
      imageAlt: "Taza bicolor negra con logotipo de Agencia UX/UI",
      isPhotoCrop: false,
      shortDescription: "Diseño limpio con emblema de Logo y nombre de marca sobre taza con interior negro.",
      fullDescription:
        "Referencia de identidad gráfica para Agencia de diseño, estudios o marcas locales sobre Taza Bicolor de 11 oz con interior y asa negros."
    }
  ],

  // Mantenemos alias `products` apuntando a `baseModels` por compatibilidad
  get products() {
    return this.baseModels;
  },

  collections: [
    {
      id: "con-tu-nombre",
      title: "Con tu nombre",
      subtitle: "Diseños con nombres, iniciales o monogramas llenos de color para que nadie confunda tu taza.",
      badge: "Nombres e iniciales",
      colorTheme: "pink",
      image: "assets/tazas-recortadas/taza-nombre-mateo.webp",
      imageAlt: "Taza blanca personalizada con inicial M ilustrada y el nombre Mateo",
      ctaText: "Ver diseños con nombre"
    },
    {
      id: "con-tus-fotos",
      title: "Con tus fotos",
      subtitle: "Fotografías reales de personas, parejas, mascotas o tus recuerdos favoritos impresos en cerámica.",
      badge: "Tus fotografías",
      colorTheme: "mint",
      image: "assets/originales-derivados/Tazas románticas al atardecer.webp",
      imageAlt: "Tazas bicolores negras con fotografía real de pareja al atardecer",
      ctaText: "Ver tazas con foto"
    },
    {
      id: "ilustraciones-originales",
      title: "Ilustraciones originales",
      subtitle: "Ilustraciones, memes de oficina y diseños de anime listos para pedir o personalizar.",
      badge: "Memes, anime e ilustración",
      colorTheme: "lime",
      image: "assets/originales-derivados/Mugs Ilustrados con Arte Botánico.png",
      imageAlt: "Tazas bicolores negras con ilustración botánica y gatito blanco",
      ctaText: "Explorar diseños"
    },
    {
      id: "para-regalar",
      title: "Para regalar",
      subtitle: "Presentaciones preparadas para sorprender en fechas especiales con un detalle listo para entregar.",
      badge: "Detalles especiales",
      colorTheme: "sky",
      image: "assets/originales-derivados/Regalo romántico de San Valentín.png",
      imageAlt: "Taza bicolor Eres mi persona favorita presentada en caja de regalo de San Valentín",
      ctaText: "Ver opciones de regalo"
    },
    {
      id: "para-tu-negocio",
      title: "Para tu negocio",
      subtitle: "Tu logotipo o identidad de marca en tazas blancas o bicolores para tu equipo, clientes o eventos.",
      badge: "Logos y empresas",
      colorTheme: "mint-alt",
      image: "assets/originales-derivados/Tazas DWONKY con acabado brillante.png",
      imageAlt: "Tazas bicolores verde lima con el logotipo empresarial DWONKY",
      ctaText: "Ver opciones para negocio"
    }
  ],

  howItWorks: [
    {
      stepNumber: "01",
      title: "1. Elige tu taza.",
      description: "Escoge el modelo y, si corresponde, el color de interior y asa.",
      accent: "pink"
    },
    {
      stepNumber: "02",
      title: "2. Compártenos tu idea.",
      description: "Selecciona tu imagen y escribe los detalles, o elige un diseño del catálogo.",
      accent: "lime"
    },
    {
      stepNumber: "03",
      title: "3. Cotiza por WhatsApp.",
      description: "Revisa tu selección y consulta disponibilidad, envío y total de tu pedido.",
      accent: "mint"
    }
  ],

  faqs: [
    {
      question: "1. ¿Cuánto tarda en estar lista mi taza?",
      answer:
        "El tiempo de preparación puede ser de 1 a 2 días, según la disponibilidad de materiales y los detalles de tu pedido. Si la necesitas antes, escríbenos para consultar opciones de pronta entrega. Te confirmamos disponibilidad y fecha antes de cerrar tu pedido. Este tiempo corresponde únicamente a la preparación de tu taza; el tiempo de traslado o envío se confirma por separado."
    },
    {
      question: "2. ¿Qué formato y calidad debe tener mi imagen?",
      answer:
        "Envíanos tu imagen original en JPG, PNG o WebP, nítida y sin compresión innecesaria. Para logotipos o diseños sin fondo, usa PNG con transparencia. Recomendamos una resolución de 300 ppp al tamaño de impresión; no necesitas recortarla a un cuadrado (1:1), ya que adaptamos la composición tanto para fotos individuales como para diseños panorámicos alrededor de la taza. Si tienes dudas sobre tu archivo, consúltanos antes de pedir."
    },
    {
      question: "3. ¿Puedo pedir un diseño del catálogo o enviar el mío?",
      answer:
        "Puedes elegir un diseño del catálogo o compartir una foto, frase, ilustración o logotipo. Para pedir uno que viste aquí, usa el nombre que aparece en “Pídela como”. Si quieres hacer cambios, entra en “Personalizar y cotizar” y cuéntanos tu idea."
    },
    {
      question: "4. ¿Cómo cotizo y confirmo mi pedido?",
      answer:
        "Elige tu diseño o prepara tu personalización y envíanos tu solicitud por WhatsApp. Ahí confirmamos los detalles, la disponibilidad, el total y la forma de pago antes de cerrar tu pedido."
    },
    {
      question: "5. ¿Cuánto cuesta el envío?",
      answer:
        "El costo y el tiempo de envío dependen de tu ubicación y de las opciones disponibles. Compártenos tu código postal por WhatsApp para cotizarlo y confirmar el total."
    }
  ]
};

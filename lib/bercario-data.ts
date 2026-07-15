export type Product = {
  id: string
  title: string
  price: string
  description: string
  image: string
  tags: string[]
}

export type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  rating: number
}

export type Faq = {
  id: string
  question: string
  answer: string
}

export type BusinessProfile = {
  name: string
  tagline: string
  description: string
  phone: string
  email: string
  address: string
  banner: string
  logo: string
  slug: string
  products: Product[]
  testimonials: Testimonial[]
  faqs: Faq[]
  gallery: string[]
  sections?: LandingSection[]
  landingConfig?: any[]
  templateId?: string
  globalStyles?: { paletteId: string; fontPairId: string; buttonStyle: 'rounded' | 'square' | 'pill' }
  niche?: string
}

export type SectionType =
  | 'HERO_BANNER'
  | 'EMPATHY_SECTION'
  | 'SOLUTION_OFFER'
  | 'VALUE_PROP'
  | 'HOW_IT_WORKS'
  | 'ABOUT_US'
  | 'TESTIMONIALS'
  | 'CONVERSION_FORM'
  | 'RISK_REVERSAL'
  | 'FAQ_ACCORDION'
  | 'FOOTER_SECTION'

export type LandingSection = {
  id: string
  type: SectionType
  order: number
  visible: boolean
  label: string
  description: string
  content: any
}

export const initialProfile: BusinessProfile = {
  name: 'Calzado La Frontera',
  tagline: 'Mayoristas de calzado y moda en Cúcuta',
  description:
    'Somos una empresa familiar con más de 15 años surtiendo a comerciantes del Norte de Santander. Ofrecemos calzado, marroquinería y accesorios al por mayor con despacho a toda Colombia y garantía en cada pedido.',
  phone: '+57 315 482 9021',
  email: 'ventas@calzadolafrontera.co',
  address: 'Av. 5 #10-42, Centro, Cúcuta',
  banner: '/images/company-banner.png',
  logo: '/images/company-logo.png',
  slug: 'calzado-la-frontera',
  products: [
    {
      id: 'p1',
      title: 'Tenis Urbanos Blanco Arena',
      price: '$68.000',
      description: 'Par x mayor desde 12 unidades. Tallas 35-42.',
      image: '/images/product-sneakers.png',
      tags: ['#Calzado', '#Mayorista', '#Cúcuta'],
    },
    {
      id: 'p2',
      title: 'Bolso Cuero Camel',
      price: '$95.000',
      description: 'Marroquinería premium, costuras reforzadas.',
      image: '/images/product-handbag.png',
      tags: ['#Marroquinería', '#Mayorista', '#Mujer'],
    },
    {
      id: 'p3',
      title: 'Botines Cuero Café',
      price: '$120.000',
      description: 'Suela antideslizante. Ideal temporada fría.',
      image: '/images/product-boots.png',
      tags: ['#Calzado', '#Cuero', '#Unisex'],
    },
    {
      id: 'p4',
      title: 'Suéter Tejido Beige',
      price: '$54.000',
      description: 'Docena surtida en tallas. Tela térmica.',
      image: '/images/product-jacket.png',
      tags: ['#Textil', '#Mayorista', '#Invierno'],
    },
    {
      id: 'p5',
      title: 'Reloj Correa Cuero',
      price: '$78.000',
      description: 'Accesorio unisex, empaque individual.',
      image: '/images/product-watch.png',
      tags: ['#Accesorios', '#Mayorista', '#Regalo'],
    },
  ],
  testimonials: [
    {
      id: 't1',
      name: 'Marisol Peña',
      role: 'Tienda El Buen Precio · Pamplona',
      quote:
        'Desde que compro con ellos mis márgenes mejoraron. Los despachos llegan completos y a tiempo.',
      rating: 5,
    },
    {
      id: 't2',
      name: 'Jorge Ramírez',
      role: 'Distribuidora JR · Ocaña',
      quote:
        'Excelente calidad al por mayor. El catálogo en línea me facilita hacer pedidos desde el celular.',
      rating: 5,
    },
    {
      id: 't3',
      name: 'Diana Vega',
      role: 'Almacén La Moda · Cúcuta',
      quote:
        'Atención cercana y precios justos. Llevo dos años surtiendo mi almacén con ellos.',
      rating: 4,
    },
  ],
  faqs: [
    {
      id: 'f1',
      question: '¿Cuál es el pedido mínimo al por mayor?',
      answer:
        'El pedido mínimo es de 12 unidades por referencia. Para docenas surtidas consulta disponibilidad con nuestro equipo.',
    },
    {
      id: 'f2',
      question: '¿Hacen despachos a todo el país?',
      answer:
        'Sí, despachamos a toda Colombia a través de transportadoras aliadas. El costo de envío depende de la ciudad de destino.',
    },
    {
      id: 'f3',
      question: '¿Qué métodos de pago aceptan?',
      answer:
        'Aceptamos transferencia, consignación y pago contra entrega en Cúcuta. Próximamente pagos en línea desde tu perfil.',
    },
  ],
  gallery: [
    '/images/company-banner.png',
    '/images/hero.png',
    '/images/product-sneakers.png',
    '/images/product-handbag.png',
    '/images/product-boots.png',
    '/images/product-watch.png',
  ],
}

export const defaultSections: LandingSection[] = [
  {
    id: 'sec_hero_default',
    type: 'HERO_BANNER',
    order: 1,
    visible: true,
    label: 'Banner principal (Héroe)',
    description: 'Imagen destacada, logo y propuesta de valor.',
    content: {
      title: 'Calzado La Frontera',
      subtitle: 'Mayoristas de calzado y moda en Cúcuta',
      ctaText: 'Ver catálogo',
      ctaUrl: '#form',
      layoutDirection: 'left-to-right',
      align: 'center',
    },
  },
  {
    id: 'sec_empathy_default',
    type: 'EMPATHY_SECTION',
    order: 2,
    visible: true,
    label: 'Empatía (Problema)',
    description: 'Sección para conectar con los puntos de dolor de tu cliente.',
    content: {
      title: '¿Cansado de no encontrar proveedores confiables?',
      description: 'Sabemos lo difícil que es encontrar mercancía de alta calidad con envíos rápidos y seguros en Colombia. Por eso creamos una solución pensada especialmente para ti.',
      align: 'center',
    },
  },
  {
    id: 'sec_solution_default',
    type: 'SOLUTION_OFFER',
    order: 3,
    visible: true,
    label: 'Oferta de Solución',
    description: 'Presenta tu producto o servicio estrella.',
    content: {
      title: 'La Solución Completa para tu Negocio',
      description: 'Ofrecemos calzado y marroquinería al por mayor con despacho inmediato, garantía directa y atención personalizada las 24 horas.',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
      ctaText: 'Solicitar Información',
      ctaUrl: '#form',
      layoutDirection: 'left-to-right',
      align: 'left',
    },
  },
  {
    id: 'sec_value_default',
    type: 'VALUE_PROP',
    order: 4,
    visible: true,
    label: 'Propuesta de Valor (Beneficios)',
    description: 'Grid modular para explicar los beneficios clave de tu oferta.',
    content: {
      title: '¿Por qué elegirnos?',
      columns: 3,
      items: [
        { title: 'Envíos a todo el país', description: 'Despachamos de forma inmediata a cualquier rincón de Colombia.' },
        { title: 'Calidad Garantizada', description: 'Cada producto pasa por un estricto control de calidad.' },
        { title: 'Precios Mayoristas', description: 'Márgenes de ganancia excelentes para tu negocio.' }
      ],
      align: 'center',
    },
  },
  {
    id: 'sec_how_default',
    type: 'HOW_IT_WORKS',
    order: 5,
    visible: true,
    label: 'Cómo Funciona (Proceso)',
    description: 'Timeline interactivo explicando los pasos de adquisición.',
    content: {
      title: 'Proceso de Compra Sencillo',
      items: [
        { step: '1', title: 'Explora el Catálogo', description: 'Elige los modelos y docenas surtidas de tu preferencia.' },
        { step: '2', title: 'Realiza tu Pedido', description: 'Contáctanos y coordinamos la entrega y medio de pago.' },
        { step: '3', title: 'Recibe en Casa', description: 'Despachamos tu pedido con seguro y garantía de entrega.' }
      ],
      align: 'center',
    },
  },
  {
    id: 'sec_about_default',
    type: 'ABOUT_US',
    order: 6,
    visible: true,
    label: 'Quiénes somos (Autoridad)',
    description: 'Biografía, trayectoria y marcas que respaldan.',
    content: {
      title: 'Nuestra Historia',
      description: 'Somos una empresa familiar con más de 15 años surtiendo a comerciantes del Norte de Santander. Ofrecemos calzado, marroquinería y accesorios al por mayor con despacho a toda Colombia.',
      signature: 'Fundador & Director General',
      align: 'left',
    },
  },
  {
    id: 'sec_testimonials_default',
    type: 'TESTIMONIALS',
    order: 7,
    visible: true,
    label: 'Testimonios (Prueba Social)',
    description: 'Carrusel o grilla de comentarios de clientes reales.',
    content: {
      title: 'Lo que dicen nuestros clientes',
      columns: 3,
      items: [
        { name: 'Diana Peña', role: 'Boutique Stella · Cúcuta', comment: 'El mejor proveedor mayorista. Despachos rápidos y excelente calidad de zapatos.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
        { name: 'Carlos Gomez', role: 'Distribuidora CG · Bucaramanga', comment: 'Precios competitivos y atención muy amable. 100% recomendados.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
      ],
      align: 'center',
    },
  },
  {
    id: 'sec_form_default',
    type: 'CONVERSION_FORM',
    order: 8,
    visible: true,
    label: 'Formulario de Registro (CRM)',
    description: 'Caja dedicada para capturar leads y correos.',
    content: {
      title: '¿Listo para impulsar tus ventas?',
      subtitle: 'Déjanos tus datos y un asesor te enviará nuestro catálogo completo en PDF hoy mismo.',
      ctaText: 'Obtener Catálogo Gratis',
      align: 'center',
    },
  },
  {
    id: 'sec_reversal_default',
    type: 'RISK_REVERSAL',
    order: 9,
    visible: true,
    label: 'Reducción de Riesgo (Garantía)',
    description: 'Bloque con sello de confianza para romper objeciones.',
    content: {
      title: 'Garantía de Satisfacción de 30 Días',
      description: 'Si la calidad de nuestra mercancía no cumple con tus expectativas, te devolvemos el 100% de tu dinero sin preguntas ni complicaciones.',
      days: 30,
      align: 'center',
    },
  },
  {
    id: 'sec_faq_default',
    type: 'FAQ_ACCORDION',
    order: 10,
    visible: true,
    label: 'Preguntas Frecuentes',
    description: 'Componente colapsable de preguntas y respuestas.',
    content: {
      title: 'Preguntas Frecuentes',
      items: [
        { question: '¿Cuál es el pedido mínimo?', answer: 'El pedido mínimo es de 12 unidades por referencia.' },
        { question: '¿Qué medios de pago aceptan?', answer: 'Aceptamos transferencias bancarias, Nequi, Daviplata y contra entrega local.' },
        { question: '¿Cuánto demora el envío?', answer: 'El despacho se realiza en 24 horas hábiles y el transporte tarda de 2 a 4 días.' }
      ],
      align: 'center',
    },
  },
  {
    id: 'sec_footer_default',
    type: 'FOOTER_SECTION',
    order: 11,
    visible: true,
    label: 'Pie de Página (Legal)',
    description: 'Enlaces a políticas legales, copyright y redes.',
    content: {
      copyright: '© 2026 Todos los derechos reservados.',
      align: 'center',
    },
  },
]

export type SectionTemplate = {
  type: SectionType
  label: string
  description: string
  repeatable: boolean
}

export const sectionTemplates: SectionTemplate[] = [
  {
    type: 'HERO_BANNER',
    label: 'Héroe / Banner principal',
    description: 'Imagen destacada, logo y propuesta de valor.',
    repeatable: true,
  },
  {
    type: 'EMPATHY_SECTION',
    label: 'Empatía (Problema)',
    description: 'Sección para conectar con los puntos de dolor de tu cliente.',
    repeatable: true,
  },
  {
    type: 'SOLUTION_OFFER',
    label: 'Oferta de Solución',
    description: 'Presenta tu producto o servicio estrella.',
    repeatable: true,
  },
  {
    type: 'VALUE_PROP',
    label: 'Propuesta de Valor (Beneficios)',
    description: 'Grid modular para explicar los beneficios clave de tu oferta.',
    repeatable: true,
  },
  {
    type: 'HOW_IT_WORKS',
    label: 'Cómo Funciona (Proceso)',
    description: 'Timeline interactivo explicando los pasos de adquisición.',
    repeatable: true,
  },
  {
    type: 'ABOUT_US',
    label: 'Quiénes somos (Autoridad)',
    description: 'Biografía, trayectoria y marcas que respaldan.',
    repeatable: true,
  },
  {
    type: 'TESTIMONIALS',
    label: 'Testimonios (Prueba Social)',
    description: 'Grilla de comentarios de clientes reales.',
    repeatable: true,
  },
  {
    type: 'CONVERSION_FORM',
    label: 'Formulario de Registro (CRM)',
    description: 'Caja dedicada para capturar leads y correos.',
    repeatable: true,
  },
  {
    type: 'RISK_REVERSAL',
    label: 'Garantía de Compra',
    description: 'Sello y términos de garantía de satisfacción.',
    repeatable: true,
  },
  {
    type: 'FAQ_ACCORDION',
    label: 'Preguntas Frecuentes',
    description: 'Componente colapsable de preguntas y respuestas.',
    repeatable: true,
  },
  {
    type: 'FOOTER_SECTION',
    label: 'Pie de Página (Legal)',
    description: 'Enlaces a políticas legales, copyright y redes.',
    repeatable: true,
  },
]

export const availableTags = [
  '#Calzado',
  '#Mayorista',
  '#Cúcuta',
  '#Cuero',
  '#Textil',
  '#Marroquinería',
  '#Accesorios',
  '#Mujer',
  '#Hombre',
  '#Unisex',
  '#Invierno',
  '#Regalo',
]

export function getLabelForType(type: SectionType): string {
  switch (type) {
    case 'HERO_BANNER': return 'Banner principal (Héroe)';
    case 'EMPATHY_SECTION': return 'Empatía (Problema)';
    case 'SOLUTION_OFFER': return 'Oferta de Solución';
    case 'VALUE_PROP': return 'Propuesta de Valor';
    case 'HOW_IT_WORKS': return 'Cómo Funciona';
    case 'ABOUT_US': return 'Quiénes somos';
    case 'TESTIMONIALS': return 'Testimonios';
    case 'CONVERSION_FORM': return 'Registro CRM';
    case 'RISK_REVERSAL': return 'Garantía de Satisfacción';
    case 'FAQ_ACCORDION': return 'Preguntas Frecuentes';
    case 'FOOTER_SECTION': return 'Pie de página';
    default: return 'Sección';
  }
}

export function getDescForType(type: SectionType): string {
  switch (type) {
    case 'HERO_BANNER': return 'Imagen destacada, logo y propuesta de valor.';
    case 'EMPATHY_SECTION': return 'Sección para conectar con los dolores del cliente.';
    case 'SOLUTION_OFFER': return 'Presentación visual y persuasiva de tu producto.';
    case 'VALUE_PROP': return 'Grid o lista detallada de beneficios clave.';
    case 'HOW_IT_WORKS': return 'Pasos visuales para el cliente (1, 2, 3).';
    case 'ABOUT_US': return 'Biografía, trayectoria y sellos de autoridad.';
    case 'TESTIMONIALS': return 'Tarjetas de opiniones y reseñas de clientes.';
    case 'CONVERSION_FORM': return 'Caja de registro para leads con formulario.';
    case 'RISK_REVERSAL': return 'Sello e información de reducción de riesgo.';
    case 'FAQ_ACCORDION': return 'Preguntas y respuestas tipo acordeón.';
    case 'FOOTER_SECTION': return 'Enlaces legales y copyright de pie de página.';
    default: return '';
  }
}

export function getDefaultContentForType(type: SectionType, profile?: BusinessProfile): any {
  switch (type) {
    case 'HERO_BANNER':
      return {
        title: profile?.name || 'Bienvenidos a mi marca',
        subtitle: profile?.tagline || 'Eslogan personalizado',
        ctaText: 'Ver catálogo',
        ctaUrl: '#form',
        layoutDirection: 'left-to-right',
        align: 'center',
      };
    case 'EMPATHY_SECTION':
      return {
        title: '¿Problemas con tus pedidos?',
        description: 'Entendemos los retrasos, la mala calidad de otros proveedores y la falta de soporte. Te mereces algo mejor.',
        align: 'center',
      };
    case 'SOLUTION_OFFER':
      return {
        title: 'Tu Socio de Negocio Confiable',
        description: 'Garantizamos mercancía premium directo desde fábrica con despacho en menos de 24 horas y soporte prioritario.',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
        ctaText: 'Solicitar Información',
        ctaUrl: '#form',
        layoutDirection: 'left-to-right',
        align: 'left',
      };
    case 'VALUE_PROP':
      return {
        title: 'Nuestros Beneficios',
        columns: 3,
        items: [
          { title: 'Envíos Rápidos', description: 'Despacho a todo el país en tiempo récord.' },
          { title: '100% Calidad', description: 'Garantía contra defectos de costuras y suelas.' },
          { title: 'Atención 24/7', description: 'Soporte vía WhatsApp para resolver dudas.' }
        ],
        align: 'center',
      };
    case 'HOW_IT_WORKS':
      return {
        title: 'Cómo comprar con nosotros',
        items: [
          { step: '1', title: 'Selecciona tus productos', description: 'Navega por nuestro catálogo digital.' },
          { step: '2', title: 'Confirma con un asesor', description: 'Validamos tallas y coordinamos envío.' },
          { step: '3', title: 'Recibe tu pedido', description: 'Tu mercancía llegará asegurada.' }
        ],
        align: 'center',
      };
    case 'ABOUT_US':
      return {
        title: 'Quiénes somos',
        description: profile?.description || 'Historia, trayectoria y propósito de nuestra marca en la región...',
        signature: 'Director de Calidad',
        align: 'left',
      };
    case 'TESTIMONIALS':
      return {
        title: 'Reseñas de Clientes',
        columns: 3,
        items: [
          { name: 'Sandra Vega', role: 'Comerciante · Pasto', comment: 'Llevo 3 años surtiendo mi tienda y mis clientes están fascinados con el calzado.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
          { name: 'Juan Restrepo', role: 'Distribuidor · Medellín', comment: 'El despacho es inmediato y el proceso de compra es muy transparente.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
        ],
        align: 'center',
      };
    case 'CONVERSION_FORM':
      return {
        title: '¿Quieres ver nuestro catálogo mayorista?',
        subtitle: 'Ingresa tus datos y obtén acceso exclusivo inmediato a nuestra colección digital.',
        ctaText: 'Ver Catálogo Ahora',
        align: 'center',
      };
    case 'RISK_REVERSAL':
      return {
        title: 'Compra con Cero Riesgos',
        description: 'Sello de garantía extendida de satisfacción. Te respaldamos en cada paso del camino.',
        days: 30,
        align: 'center',
      };
    case 'FAQ_ACCORDION':
      return {
        title: 'Preguntas Frecuentes',
        items: [
          { question: '¿Despachan al por mayor?', answer: 'Sí, despachos desde una docena de calzado.' },
          { question: '¿Tiene garantía la mercancía?', answer: 'Absolutamente, garantía directa por defectos de fabricación.' }
        ],
        align: 'center',
      };
    case 'FOOTER_SECTION':
      return {
        copyright: '© 2026 Todos los derechos reservados.',
        align: 'center',
      };
    default:
      return {};
  }
}

export function migrateSections(sections: any[], profile: BusinessProfile): LandingSection[] {
  if (!Array.isArray(sections) || sections.length === 0) {
    return defaultSections;
  }

  // Comprobar si ya viene en el formato nuevo
  const hasNewType = sections.some(s => ['HERO_BANNER', 'ABOUT_US', 'PRODUCTS_LIST', 'CONTACT_INFO', 'FEATURES_LIST'].includes(s.type));

  if (hasNewType) {
    return sections.map((s, idx) => ({
      id: s.id || `sec_${s.type.toLowerCase()}_${idx}`,
      type: s.type,
      order: typeof s.order === 'number' ? s.order : idx + 1,
      visible: typeof s.visible === 'boolean' ? s.visible : true,
      label: s.label || getLabelForType(s.type),
      description: s.description || getDescForType(s.type),
      content: s.content || getDefaultContentForType(s.type, profile),
    }));
  }

  // Migrar formato antiguo a nuevo
  const newSections: LandingSection[] = [];
  sections.forEach((s, idx) => {
    let type: SectionType = 'HERO_BANNER';
    if (s.type === 'banner') type = 'HERO_BANNER';
    else if (s.type === 'about') type = 'ABOUT_US';
    else if (s.type === 'products' || s.type === 'catalog') type = 'PRODUCTS_LIST';
    else if (s.type === 'contact') type = 'CONTACT_INFO';
    else if (s.type === 'testimonials') type = 'TESTIMONIALS';
    else if (s.type === 'faq') type = 'FAQ';
    else return; // Ignorar tipos no reconocidos

    newSections.push({
      id: `sec_${type.toLowerCase()}_${idx}_${Date.now()}`,
      type,
      order: idx + 1,
      visible: true,
      label: getLabelForType(type),
      description: getDescForType(type),
      content: getDefaultContentForType(type, profile),
    });
  });

  return newSections;
}

export const palettes = [
  { id: 'nido', name: 'Nido (por defecto)', colors: ['#f5f3ef', '#d9c7a8', '#3a352f'] },
  { id: 'arena', name: 'Arena cálida', colors: ['#faf6f0', '#e0b088', '#4a3c30'] },
  { id: 'bosque', name: 'Bosque sereno', colors: ['#f2f5f1', '#a7c4a0', '#2f3d2c'] },
  { id: 'pizarra', name: 'Pizarra elegante', colors: ['#18181b', '#a1a1aa', '#f4f4f5'] }, // Dark theme
  { id: 'neon_cyber', name: 'Cyber Neón', colors: ['#0f172a', '#06b6d4', '#e2e8f0'] },
  { id: 'coral_sunset', name: 'Coral Sunset', colors: ['#fff7ed', '#f97316', '#431407'] },
]

export const fontPairs = [
  { 
    id: 'modern_serif', 
    name: 'Playfair Display & Inter', 
    titleFont: "'Playfair Display', Georgia, serif", 
    bodyFont: "'Inter', sans-serif" 
  },
  { 
    id: 'classic_sans', 
    name: 'Inter & System Sans', 
    titleFont: "'Inter', system-ui, sans-serif", 
    bodyFont: "'Inter', system-ui, sans-serif" 
  },
  { 
    id: 'playful_sans', 
    name: 'Outfit & Poppins', 
    titleFont: "'Outfit', sans-serif", 
    bodyFont: "'Poppins', sans-serif" 
  },
]

export const buttonStyles = [
  { id: 'rounded', name: 'Redondeado suave' },
  { id: 'square', name: 'Cuadrado recto' },
  { id: 'pill', name: 'Píldora ovalada' },
]


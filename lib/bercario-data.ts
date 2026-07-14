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
}

export type SectionType =
  | 'HERO_BANNER'
  | 'ABOUT_US'
  | 'PRODUCTS_LIST'
  | 'CONTACT_INFO'
  | 'FEATURES_LIST'
  | 'TESTIMONIALS'
  | 'FAQ'

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
    label: 'Banner principal',
    description: 'Imagen destacada, logo y nombre del negocio.',
    content: {
      title: 'Calzado La Frontera',
      subtitle: 'Mayoristas de calzado y moda en Cúcuta',
      ctaText: 'Ver catálogo',
      backgroundColor: '#f5f3ef',
    },
  },
  {
    id: 'sec_about_default',
    type: 'ABOUT_US',
    order: 2,
    visible: true,
    label: 'Quiénes somos',
    description: 'Descripción y propuesta de valor del negocio.',
    content: {
      title: 'Quiénes somos',
      description: 'Somos una empresa familiar con más de 15 años surtiendo a comerciantes del Norte de Santander. Ofrecemos calzado, marroquinería y accesorios al por mayor con despacho a toda Colombia y garantía en cada pedido.',
    },
  },
  {
    id: 'sec_products_default',
    type: 'PRODUCTS_LIST',
    order: 3,
    visible: true,
    label: 'Catálogo de productos',
    description: 'Grilla de productos con precios y etiquetas.',
    content: {
      title: 'Catálogo',
      subtitle: '5 productos disponibles al por mayor',
    },
  },
  {
    id: 'sec_contact_default',
    type: 'CONTACT_INFO',
    order: 4,
    visible: true,
    label: 'Formulario de contacto',
    description: 'Datos de contacto y formulario para clientes.',
    content: {
      title: 'Contáctanos',
      phone: '+57 315 482 9021',
      email: 'ventas@calzadolafrontera.co',
      address: 'Av. 5 #10-42, Centro, Cúcuta',
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
    type: 'FEATURES_LIST',
    label: 'Lista de Servicios / Características',
    description: 'Bloque modular con título y tarjetas de servicios o características.',
    repeatable: true,
  },
  {
    type: 'HERO_BANNER',
    label: 'Banner de Héroe adicional',
    description: 'Banner visual con título, subtítulo, botón CTA y color de fondo.',
    repeatable: true,
  },
  {
    type: 'ABOUT_US',
    label: 'Quiénes Somos adicional',
    description: 'Sección de texto descriptivo e informativo.',
    repeatable: true,
  },
  {
    type: 'PRODUCTS_LIST',
    label: 'Catálogo de Productos',
    description: 'Muestra la grilla de productos activos.',
    repeatable: true,
  },
  {
    type: 'CONTACT_INFO',
    label: 'Información de Contacto',
    description: 'Formulario de contacto y datos de dirección/correo/teléfono.',
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
    case 'HERO_BANNER': return 'Banner principal';
    case 'ABOUT_US': return 'Quiénes somos';
    case 'PRODUCTS_LIST': return 'Catálogo de productos';
    case 'CONTACT_INFO': return 'Formulario de contacto';
    case 'FEATURES_LIST': return 'Nuestros Servicios';
    case 'TESTIMONIALS': return 'Testimonios / Reseñas';
    case 'FAQ': return 'Preguntas frecuentes';
    default: return 'Sección';
  }
}

export function getDescForType(type: SectionType): string {
  switch (type) {
    case 'HERO_BANNER': return 'Imagen destacada, logo y nombre del negocio.';
    case 'ABOUT_US': return 'Descripción y propuesta de valor del negocio.';
    case 'PRODUCTS_LIST': return 'Grilla de productos con precios y etiquetas.';
    case 'CONTACT_INFO': return 'Datos de contacto y formulario para clientes.';
    case 'FEATURES_LIST': return 'Lista de características o servicios modulares.';
    case 'TESTIMONIALS': return 'Opiniones y reseñas de tus clientes.';
    case 'FAQ': return 'Preguntas frecuentes con formato acordeón.';
    default: return '';
  }
}

export function getDefaultContentForType(type: SectionType, profile?: BusinessProfile): any {
  switch (type) {
    case 'HERO_BANNER':
      return {
        title: profile?.name || 'Bienvenidos a mi marca',
        subtitle: profile?.tagline || 'Eslogan personalizado',
        ctaText: 'Contactar',
        backgroundColor: '#f5f3ef',
      };
    case 'ABOUT_US':
      return {
        title: 'Quiénes somos',
        description: profile?.description || 'Descripción e historia de nuestra empresa...',
      };
    case 'PRODUCTS_LIST':
      return {
        title: 'Catálogo',
        subtitle: `${profile?.products?.length || 0} productos disponibles al por mayor`,
      };
    case 'CONTACT_INFO':
      return {
        title: 'Contáctanos',
        phone: profile?.phone || '',
        email: profile?.email || '',
        address: profile?.address || '',
      };
    case 'FEATURES_LIST':
      return {
        title: 'Nuestros Servicios',
        items: [
          { title: 'Servicio 1', description: 'Descripción detallada 1' },
          { title: 'Servicio 2', description: 'Descripción detallada 2' },
        ],
      };
    case 'TESTIMONIALS':
      return {
        title: 'Lo que dicen nuestros clientes',
      };
    case 'FAQ':
      return {
        title: 'Preguntas Frecuentes',
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
